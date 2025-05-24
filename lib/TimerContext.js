'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from './supabaseClient';

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  // The context from the supabase authentication 
  const { user } = useAuth();
  // Remaining time in seconds for the current session (counts down)
  const [remainingTime, setRemainingTime] = useState(0);
  // Total accumulated study time in seconds for the current session (counts up)
  const [accumulatedTime, setAccumulatedTime] = useState(0);
  // Whether the timer is currently running
  const [isRunning, setIsRunning] = useState(false);
  // ID of the currently active session in the database
  const [activeSessionId, setActiveSessionId] = useState(null);
  // Timestamp when the current session started
  const [sessionStartTime, setSessionStartTime] = useState(null);
  // Whether the current timer is a break session
  const [isBreak, setIsBreak] = useState(false);
  // Time remaining from the study session before break started
  const [storedStudyTime, setStoredStudyTime] = useState(null);
  // Currently selected study topic
  const [selectedTopic, setSelectedTopic] = useState(null);
  // Whether the current session is a Pomodoro session
  const [isPomodoro, setIsPomodoro] = useState(false);
  // Current position in the Pomodoro cycle (0-7)
  const [pomodoroCycle, setPomodoroCycle] = useState(0);
  // Pomodoro timer settings (durations and number of cycles)
  const [pomodoroSettings, setPomodoroSettings] = useState({
    studyDuration: 25 * 60,
    shortBreakDuration: 5 * 60,
    longBreakDuration: 15 * 60,
    cycles: 4
  });

  // Load active session on mount
  useEffect(() => {
    const loadActiveSession = async () => {
      if (!user) return;

      try {
        // First, get the (if any) active sessions for the user
        const { data: sessions, error: fetchError } = await supabase
          .from('active_sessions')
          .select('*')
          .eq('user_id', user.id)

        if (fetchError) throw fetchError;
      } catch (error) {
        console.error('Error loading active session:', error);
      }
    };

    loadActiveSession();
  }, [user]);

  const startTimer = useCallback(async (initialTime, isBreakSession = false) => {
    if (!user) return;

    const startTime = new Date();
    setSessionStartTime(startTime);
    setRemainingTime(initialTime);
    setIsRunning(true);
    setIsBreak(isBreakSession);

    try {
      const formattedDate = startTime.toISOString().slice(0, 19).replace('T', ' ');
      
      // Get topic ID from the selected topic, ensuring it's a string
      let topicId = null;

      if (selectedTopic?.id) {
        // Ensure the ID is a string and matches UUID format
        const idStr = String(selectedTopic.id);
        
        // UUID format validation
        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const isValidUUID = uuidPattern.test(idStr);
        
        if (isValidUUID) {
          topicId = idStr;
        } else {
          console.error('Invalid topic ID format:', idStr);
          throw new Error('Invalid topic ID format. Expected UUID.');
        }
      }

      // Prepare session data
      const sessionData = {
        user_id: user.id,
        start_time: formattedDate,
        initial_time: initialTime,
        current_time: initialTime,
        is_running: true,
        is_break: isBreakSession,
        stored_study_time: storedStudyTime,
        last_updated: formattedDate,
        topic_id: topicId
      };
      
      // Delete the old active session if it exists
      if (activeSessionId) {
        const { error: deleteError } = await supabase
          .from('active_sessions')
          .delete()
          .eq('id', activeSessionId);

        if (deleteError) {
          console.error('Error deleting old session:', deleteError);
        }
      }

      // Create new active session
      const { data, error } = await supabase
        .from('active_sessions')
        .insert(sessionData)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data returned from session creation');
      }

      setActiveSessionId(data.id);
    } catch (err) {
      console.error('Error starting timer:', err);
      setIsRunning(false);
      // Reset states on error
      setSessionStartTime(null);
      setRemainingTime(0);
      setIsRunning(false);
      setIsBreak(false);
    }
  }, [user, selectedTopic, activeSessionId, storedStudyTime]);

  // Memoize handler functions to prevent infinite re-renders
  const updateStreak = useCallback(async (userId) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get current streak data
      const { data: streakData, error: fetchError } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', userId)
        .single();

      // PGRST116 is a PostgREST error that occurs when no rows are found
      // We ignore this error because it means the user doesn't have a streak record yet
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
  }, []);

  const handleTimerEnd = useCallback(async (interrupted) => {
    if (!sessionStartTime || !activeSessionId) return;

    const endedAt = new Date();
    const totalSeconds = Math.floor((endedAt - sessionStartTime) / 1000);

    try {
      // Get the current active session to check for break time
      const { data: activeSession, error: fetchError } = await supabase
        .from('active_sessions')
        .select('break_time')
        .eq('id', activeSessionId)
        .single();

      if (fetchError) throw fetchError;

      // Save completed session
      const { error: sessionError } = await supabase
        .from('study_sessions')
        .insert({
          user_id: user.id,
          start_time: sessionStartTime.toISOString().slice(0, 19).replace('T', ' '),
          end_time: endedAt.toISOString().slice(0, 19).replace('T', ' '),
          total_seconds: totalSeconds,
          break_time: activeSession?.break_time || 0,
          interrupted: interrupted,
          topic_id: selectedTopic?.id || null
        });

      if (sessionError) throw sessionError;

      // Delete active session
      const { error: deleteError } = await supabase
        .from('active_sessions')
        .delete()
        .eq('id', activeSessionId);

      if (deleteError) throw deleteError;

      // Reset states
      setRemainingTime(0);
      setIsRunning(false);
      setActiveSessionId(null);
      setSessionStartTime(null);
      setAccumulatedTime(0);
      setIsBreak(false);
      setIsPomodoro(false);
      setPomodoroCycle(0);
      setSelectedTopic(null);
      document.title = 'Study Session';

      // Update streak
      await updateStreak(user.id);
    } catch (err) {
      console.error('Error ending session:', err);
    }
  }, [sessionStartTime, activeSessionId, user, selectedTopic, updateStreak]);

  const handleBreakEnd = useCallback(async () => {
    if (!isBreak) return;

    // End break session
    const endedAt = new Date();
    const breakDuration = Math.floor((endedAt - sessionStartTime) / 1000);

    try {
      // Update the active session with break time
      const { error: updateError } = await supabase
        .from('active_sessions')
        .update({
          break_time: breakDuration
        })
        .eq('id', activeSessionId);

      if (updateError) {
        console.error('Error updating break time:', updateError);
        throw updateError;
      }

      // Delete active session
      const { error: deleteError } = await supabase
        .from('active_sessions')
        .delete()
        .eq('id', activeSessionId);

      if (deleteError) {
        console.error('Error deleting active session:', deleteError);
        throw deleteError;
      }

      // Restore study session with stored time
      if (storedStudyTime) {
        console.log('Restoring study session with time:', storedStudyTime);
        await startTimer(storedStudyTime, false);
        setStoredStudyTime(null);
      }
    } catch (err) {
      console.error('Error ending break:', err);
      // If there's an error, try to restore the study session anyway
      if (storedStudyTime) {
        console.log('Attempting to restore study session after error');
        await startTimer(storedStudyTime, false);
        setStoredStudyTime(null);
      }
    }
  }, [isBreak, sessionStartTime, activeSessionId, storedStudyTime, startTimer]);

  const handlePomodoroCycleEnd = useCallback(async () => {
    const nextCycle = pomodoroCycle + 1;
    setPomodoroCycle(nextCycle);

    if (nextCycle === 8) {
      // End of full Pomodoro cycle
      setIsPomodoro(false);
      setPomodoroCycle(0);
      document.title = 'Study Session';
      handleTimerEnd(false);
      return;
    }

    if (nextCycle % 2 === 1) {
      // Short break (5 minutes)
      await startTimer(5 * 60, true);
    } else if (nextCycle === 7) {
      // Long break (15 minutes)
      await startTimer(15 * 60, true);
    } else {
      // Study session (25 minutes)
      await startTimer(25 * 60, false);
    }
  }, [pomodoroCycle, handleTimerEnd, startTimer]);

  // Timer tick effect: runs every second when timer is active
  useEffect(() => {
    // Don't start interval if timer is not running or no active session
    if (!isRunning || !activeSessionId) return;

    const interval = setInterval(async () => {
      // Update the countdown timer
      setRemainingTime((prev) => {
        // When timer reaches 1 second or less
        if (prev <= 1) {
          clearInterval(interval);
          if (isBreak) {
            // If break ends naturally, restore study time
            handleBreakEnd();
          } else if (isPomodoro) {
            // Handle Pomodoro cycle completion
            handlePomodoroCycleEnd();
          } else {
            // Regular study session ended
            handleTimerEnd(false);
          }
          return 0;
        }
        // Decrease timer by 1 second
        return prev - 1;
      });

      // Update database every second with current timer state
      const { error } = await supabase
        .from('active_sessions')
        .update({
          current_time: remainingTime - 1,
          last_updated: new Date().toISOString().slice(0, 19).replace('T', ' ')
        })
        .eq('id', activeSessionId);

      if (error) {
        console.error('Error updating active session:', error);
      }
    }, 1000);

    // Clean up interval when component unmounts or dependencies change
    return () => clearInterval(interval);
  }, [isRunning, activeSessionId, remainingTime, isBreak, isPomodoro, handleBreakEnd, handlePomodoroCycleEnd, handleTimerEnd]);

  // Update document title
  useEffect(() => {
    if (remainingTime > 0) {
      const formattedTime = formatTime(remainingTime).replace(/\s+/g, '');
      if (isPomodoro) {
        const status = getPomodoroStatus();
        document.title = `${formattedTime} - Pomodoro ${status?.cycle}/${status?.totalCycles}`;
      } else {
        document.title = `${formattedTime} - ${isBreak ? 'Break' : 'Study Session'}`;
      }
    } else {
      if (isPomodoro) {
        const status = getPomodoroStatus();
        document.title = `Pomodoro ${status?.cycle}/${status?.totalCycles}`;
      } else {
        document.title = isBreak ? 'Break' : 'Study Session';
      }
    }
  }, [remainingTime, isBreak, isPomodoro]);

  // Calculate total study time
  useEffect(() => {
    if (sessionStartTime && isRunning) {
      const interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now - sessionStartTime) / 1000);
        setAccumulatedTime(elapsed);
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

      setRemainingTime(0);
      setActiveSessionId(null);
      setSessionStartTime(null);
    } catch (error) {
      console.error('Error stopping timer:', error);
    }
  };

  const startBreak = async () => {
    if (!isRunning || isBreak) return;

    // Store current study time
    setStoredStudyTime(remainingTime);
    pauseTimer();

    // Start break timer
    await startTimer(5 * 60, true); // 5-minute break
  };

  const startPomodoro = async (settings = pomodoroSettings) => {
    if (!user) return;

    setPomodoroSettings(settings);
    setIsPomodoro(true);
    setIsBreak(false);
    setPomodoroCycle(0);
    
    // Start the first study session
    const startTime = new Date();
    setSessionStartTime(startTime);
    setRemainingTime(settings.studyDuration);
    setIsRunning(true);

    try {
      const formattedDate = startTime.toISOString().slice(0, 19).replace('T', ' ');
      
      // Prepare session data
      const sessionData = {
        user_id: user.id,
        start_time: formattedDate,
        initial_time: settings.studyDuration,
        current_time: settings.studyDuration,
        is_running: true,
        is_break: false,
        is_pomodoro: true,
        pomodoro_cycle: 0,
        last_updated: formattedDate,
        topic_id: selectedTopic?.id || null
      };

      // Delete any existing active session
      if (activeSessionId) {
        const { error: deleteError } = await supabase
          .from('active_sessions')
          .delete()
          .eq('id', activeSessionId);

        if (deleteError) throw deleteError;
      }

      // Create new Pomodoro session
      const { data, error } = await supabase
        .from('active_sessions')
        .insert(sessionData)
        .select()
        .single();

      if (error) throw error;

      setActiveSessionId(data.id);
    } catch (err) {
      console.error('Error starting Pomodoro:', err);
      setIsRunning(false);
      setIsPomodoro(false);
      setSessionStartTime(null);
      setRemainingTime(0);
    }
  };

  const getPomodoroStatus = () => {
    if (!isPomodoro) return null;

    const totalCycles = pomodoroSettings.cycles;
    const isStudy = !isBreak;
    const isLongBreak = isBreak && pomodoroCycle % 4 === 0;

    return {
      cycle: pomodoroCycle,
      totalCycles,
      isStudy,
      isLongBreak,
      nextDuration: isStudy 
        ? (pomodoroCycle % 4 === 0 ? pomodoroSettings.longBreakDuration : pomodoroSettings.shortBreakDuration)
        : pomodoroSettings.studyDuration
    };
  };

  const handlePomodoroComplete = () => {
    if (!isPomodoro) return;

    const status = getPomodoroStatus();
    if (status.isStudy) {
      // Study session completed, start break
      setIsBreak(true);
      setRemainingTime(status.nextDuration);
    } else {
      // Break completed, start next study session
      setIsBreak(false);
      setPomodoroCycle(prev => {
        const nextCycle = prev + 1;
        if (nextCycle > pomodoroSettings.cycles) {
          // All cycles completed
          setIsPomodoro(false);
          return 1;
        }
        return nextCycle;
      });
      setRemainingTime(pomodoroSettings.studyDuration);
    }
  };

  return (
    <TimerContext.Provider value={{
      remainingTime,
      isRunning,
      accumulatedStudyTime: accumulatedTime,
      formatTime,
      startTimer,
      pauseTimer,
      resumeTimer,
      handleTimerEnd,
      stopTimer,
      isBreak,
      startBreak,
      handleBreakEnd,
      isPomodoro,
      startPomodoro,
      getPomodoroStatus,
      handlePomodoroComplete,
      selectedTopic,
      setSelectedTopic,
      pomodoroSettings,
      setPomodoroSettings
    }}>
      {children}
    </TimerContext.Provider>
  );
};

export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
} 