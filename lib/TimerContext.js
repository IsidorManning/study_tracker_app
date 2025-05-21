'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from './supabaseClient';

const TimerContext = createContext();

export function TimerProvider({ children }) {
  const { user } = useAuth();
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [totalStudyTime, setTotalStudyTime] = useState(0);

  // Load active session on mount
  useEffect(() => {
    const loadActiveSession = async () => {
      if (!user) return;

      try {
        // First, get all active sessions for the user
        const { data: sessions, error: fetchError } = await supabase
          .from('active_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('last_updated', { ascending: false });

        if (fetchError) throw fetchError;

        if (sessions && sessions.length > 0) {
          // If we have multiple sessions, keep only the most recent one
          if (sessions.length > 1) {
            // Delete all but the most recent session
            const { error: deleteError } = await supabase
              .from('active_sessions')
              .delete()
              .in('id', sessions.slice(1).map(s => s.id));

            if (deleteError) throw deleteError;
          }

          // Use the most recent session
          const mostRecentSession = sessions[0];
          setTime(mostRecentSession.current_time);
          setIsRunning(mostRecentSession.is_running);
          setActiveSessionId(mostRecentSession.id);
          setSessionStartTime(new Date(mostRecentSession.start_time));
        }
      } catch (error) {
        console.error('Error loading active session:', error);
        // If there's an error, clean up any existing sessions
        try {
          await supabase
            .from('active_sessions')
            .delete()
            .eq('user_id', user.id);
        } catch (cleanupError) {
          console.error('Error cleaning up sessions:', cleanupError);
        }
      }
    };

    loadActiveSession();
  }, [user]);

  // Timer tick effect
  useEffect(() => {
    if (!isRunning || !activeSessionId) return;

    const interval = setInterval(async () => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSessionEnd(false);
          return 0;
        }
        return prev - 1;
      });

      // Update database every second
      const { error } = await supabase
        .from('active_sessions')
        .update({
          current_time: time - 1,
          last_updated: new Date().toISOString().slice(0, 19).replace('T', ' ')
        })
        .eq('id', activeSessionId);

      if (error) {
        console.error('Error updating active session:', error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, activeSessionId, time]);

  // Update document title
  useEffect(() => {
    if (time > 0) {
      const formattedTime = formatTime(time).replace(/\s+/g, '');
      document.title = `${formattedTime} - Study Session`;
    } else {
      document.title = 'Study Session';
    }
  }, [time]);

  // Calculate total study time
  useEffect(() => {
    if (sessionStartTime && isRunning) {
      const interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now - sessionStartTime) / 1000);
        setTotalStudyTime(elapsed);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [sessionStartTime, isRunning]);

  const formatTime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const startTimer = async (initialTime) => {
    if (!user) return;

    const startTime = new Date();
    setSessionStartTime(startTime);
    setTime(initialTime);
    setIsRunning(true);

    try {
      const formattedDate = startTime.toISOString().slice(0, 19).replace('T', ' ');
      
      const { data, error } = await supabase
        .from('active_sessions')
        .insert({
          user_id: user.id,
          start_time: formattedDate,
          initial_time: initialTime,
          current_time: initialTime,
          is_running: true,
          last_updated: formattedDate
        })
        .select()
        .single();

      if (error) throw error;
      setActiveSessionId(data.id);
    } catch (err) {
      console.error('Error starting timer:', err);
      setIsRunning(false);
    }
  };

  const pauseTimer = async () => {
    if (!activeSessionId) return;

    setIsRunning(false);
    try {
      const formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      
      const { error } = await supabase
        .from('active_sessions')
        .update({
          is_running: false,
          last_updated: formattedDate
        })
        .eq('id', activeSessionId);

      if (error) throw error;
    } catch (err) {
      console.error('Error pausing timer:', err);
    }
  };

  const resumeTimer = async () => {
    if (!activeSessionId) return;

    setIsRunning(true);
    try {
      const formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      
      const { error } = await supabase
        .from('active_sessions')
        .update({
          is_running: true,
          last_updated: formattedDate
        })
        .eq('id', activeSessionId);

      if (error) throw error;
    } catch (err) {
      console.error('Error resuming timer:', err);
    }
  };

  const handleSessionEnd = async (interrupted) => {
    if (!sessionStartTime || !activeSessionId) return;

    const endedAt = new Date();
    const totalSeconds = Math.floor((endedAt - sessionStartTime) / 1000);

    try {
      // Save completed session
      const { error: sessionError } = await supabase
        .from('study_sessions')
        .insert({
          user_id: user.id,
          start_time: sessionStartTime.toISOString().slice(0, 19).replace('T', ' '),
          end_time: endedAt.toISOString().slice(0, 19).replace('T', ' '),
          total_seconds: totalSeconds,
          interrupted: interrupted
        });

      if (sessionError) throw sessionError;

      // Delete active session
      const { error: deleteError } = await supabase
        .from('active_sessions')
        .delete()
        .eq('id', activeSessionId);

      if (deleteError) throw deleteError;

      // Reset states
      setTime(0);
      setIsRunning(false);
      setActiveSessionId(null);
      setSessionStartTime(null);
      setTotalStudyTime(0);

      // Update streak
      await updateStreak(user.id);
    } catch (err) {
      console.error('Error ending session:', err);
    }
  };

  const updateStreak = async (userId) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get current streak data
      const { data: streakData, error: fetchError } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      if (!streakData) {
        // Create new streak record
        const { error: insertError } = await supabase
          .from('user_streaks')
          .insert([{
            user_id: userId,
            current_streak: 1,
            longest_streak: 1,
            last_study_date: today
          }]);

        if (insertError) throw insertError;
        return;
      }

      const lastStudyDate = new Date(streakData.last_study_date);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      // Check if the last study date was yesterday
      if (lastStudyDate.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
        // Increment streak
        const newStreak = streakData.current_streak + 1;
        const { error: updateError } = await supabase
          .from('user_streaks')
          .update({
            current_streak: newStreak,
            longest_streak: Math.max(newStreak, streakData.longest_streak),
            last_study_date: today
          })
          .eq('user_id', userId);

        if (updateError) throw updateError;
      } else if (lastStudyDate.toISOString().split('T')[0] !== today) {
        // Reset streak if last study was not today or yesterday
        const { error: updateError } = await supabase
          .from('user_streaks')
          .update({
            current_streak: 1,
            last_study_date: today
          })
          .eq('user_id', userId);

        if (updateError) throw updateError;
      }
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  const stopTimer = async () => {
    if (!isRunning) return;

    setIsRunning(false);
    const endTime = new Date();
    const duration = Math.floor((endTime - sessionStartTime) / 1000);

    try {
      // Save the completed session
      const { error: sessionError } = await supabase
        .from('study_sessions')
        .insert([{
          user_id: user.id,
          start_time: sessionStartTime.toISOString(),
          end_time: endTime.toISOString(),
          duration: duration,
          total_seconds: duration
        }]);

      if (sessionError) throw sessionError;

      // Update streak
      await updateStreak(user.id);

      // Delete the active session
      if (activeSessionId) {
        const { error: deleteError } = await supabase
          .from('active_sessions')
          .delete()
          .eq('id', activeSessionId);

        if (deleteError) throw deleteError;
      }

      setTime(0);
      setActiveSessionId(null);
      setSessionStartTime(null);
    } catch (error) {
      console.error('Error stopping timer:', error);
    }
  };

  return (
    <TimerContext.Provider value={{
      time,
      isRunning,
      totalStudyTime,
      formatTime,
      startTimer,
      pauseTimer,
      resumeTimer,
      handleSessionEnd,
      stopTimer
    }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
} 