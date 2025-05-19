"use client"
import React, { useState, useEffect } from 'react';
import { IconPlayerPlay, IconPlayerPause, IconList, IconX } from '@tabler/icons-react';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabaseClient';

const Timer = () => {
  const { user } = useAuth();
  const [time, setTime] = useState(0); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [inputTime, setInputTime] = useState('');
  const [rawInput, setRawInput] = useState('');
  const [shouldStart, setShouldStart] = useState(false);
  
  // Session tracking states
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [pauseCount, setPauseCount] = useState(0);
  const [pausedSeconds, setPausedSeconds] = useState(0);
  const [lastPauseTime, setLastPauseTime] = useState(null);
  const [initialTime, setInitialTime] = useState(0);
  const [addedTime, setAddedTime] = useState(0); // Track added time

  const presets = [
    { label: '30 minutes', value: 30 * 60 },
    { label: '45 minutes', value: 45 * 60 },
    { label: '1 hour', value: 60 * 60 },
    { label: '1.5 hours', value: 90 * 60 },
    { label: '2 hours', value: 120 * 60 },
  ];

  const quickAddTimes = [
    { label: '+5m', value: 5 * 60 },
    { label: '+20m', value: 20 * 60 },
    { label: '+40m', value: 40 * 60 },
  ];

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          handleSessionEnd(false); // Timer completed naturally
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `
      ${h}:
      ${m.toString().padStart(2, '0')}:
      ${s.toString().padStart(2, '0')}
    `;
  };

  const handleStart = () => {
    if (time > 0) {
      setIsRunning(true);
      if (!sessionStartTime) {
        setSessionStartTime(new Date());
        setInitialTime(time);
      }
    }
  };

  const handlePause = () => {
    if (isRunning) {
      setPauseCount(prev => prev + 1);
      setLastPauseTime(new Date());
    } else if (lastPauseTime) {
      // Calculate paused duration when resuming
      const pauseDuration = Math.floor((new Date() - lastPauseTime) / 1000);
      setPausedSeconds(prev => prev + pauseDuration);
      setLastPauseTime(null);
    }
    setIsRunning(false);
  };

  const handleAddTime = (seconds) => {
    setTime(prev => prev + seconds);
    setAddedTime(prev => prev + seconds);
  };

  const handleSessionEnd = async (interrupted) => {
    if (!sessionStartTime) return;

    const endedAt = new Date();
    // Calculate actual time spent in seconds
    const actualSeconds = Math.floor((endedAt - sessionStartTime) / 1000);
    // Subtract paused time to get the actual study time
    const totalSeconds = actualSeconds - pausedSeconds;
    
    try {
      // First check if user is authenticated
      if (!user) {
        throw new Error('User not authenticated');
      }

      const sessionData = {
        user_id: user.id,
        start_time: sessionStartTime.toISOString(),
        end_time: endedAt.toISOString(),
        total_seconds: totalSeconds,
        pause_count: pauseCount,
        paused_seconds: pausedSeconds,
        interrupted: interrupted,
        added_time: addedTime,
      };

      console.log('Attempting to save session with data:', sessionData);

      const { data, error } = await supabase
        .from('study_sessions')
        .insert(sessionData)
        .select();

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('Session saved successfully:', data);

      // Reset all session tracking states
      setSessionStartTime(null);
      setPauseCount(0);
      setPausedSeconds(0);
      setLastPauseTime(null);
      setInitialTime(0);
      setAddedTime(0);
      setTime(0);
    } catch (error) {
      console.error('Error saving session:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        stack: error.stack
      });
      // You might want to show this error to the user
      alert(`Failed to save session: ${error.message}`);
    }
  };

  const handleExit = () => {
    if (sessionStartTime) {
      handleSessionEnd(true); // Session was interrupted
    }
    setIsRunning(false);
    setTime(0);
  };

  const handleTimerClickEvent = () => {
    if (!isRunning && !isEditing) {
      setRawInput('');
      setIsEditing(true);
    }
  };

  const handleInputChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '');
    setRawInput(raw);
  
    // Step 1: Limit to last 6 digits to prevent overflow
    raw = raw.slice(-6); // keep only right-most 6 digits
  
    // Step 2: Pad left to ensure consistent formatting (like a calculator)
    const padded = raw.padStart(6, '0');
  
    // Step 3: Extract digits
    const hours = String(parseInt(padded.slice(0, 2), 10)); // drop leading zeros
    const minutes = padded.slice(2, 4);
    const seconds = padded.slice(4, 6);
  
    // Step 4: Format
    const formatted = `${hours}:${minutes}:${seconds}`;
    setInputTime(formatted);
  };
  
  

  const handleTimeSubmit = (e) => {
    e.preventDefault();
    
    // If no input was provided, keep the current time
    if (!rawInput) {
      setIsEditing(false);
      return;
    }

    const parts = inputTime.split(':').map(Number);
    
    if (parts.some(isNaN)) {
      alert('Invalid format');
      return;
    }

    // Pad to [h, m, s]
    while (parts.length < 3) parts.unshift(0);
    let [hours, minutes, seconds] = parts;

    if (seconds > 60) {
      minutes += Math.trunc(seconds / 60)
      seconds = ((seconds / 60) - Math.trunc(seconds / 60)) * 60
    }

    if (minutes > 60) {
      hours += Math.trunc(minutes / 60)
      minutes = ((minutes / 60) - Math.trunc(minutes / 60)) * 60
    }

    const total = hours * 3600 + minutes * 60 + seconds;

    if (total > 0) {
      setTime(total);
      setIsEditing(false);
      setShouldStart(true); // Signal that we want to start the timer
    }
  };

  const handlePresetSelect = (sec) => {
    setTime(sec);
    setShowPresets(false);
    setShouldStart(true); // Add this to start the timer after selection
  };

  // Effect to handle starting the timer after time is set
  useEffect(() => {
    if (shouldStart && time > 0) {
      setIsRunning(true);
      setShouldStart(false);
    }
  }, [time, shouldStart]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-[80vw] p-6 xl:w-[60vw] rounded-full h-full border-2 border-white">
        <div className="bg-mbg-2 rounded-3xl p-8 shadow-lg flex flex-col items-center ml-8">
          <div className="relative" 
            onClick={handleTimerClickEvent}>
            {isEditing ? (
              <form onSubmit={handleTimeSubmit} className="text-center">
                <input
                  type="text"
                  value={inputTime}
                  onChange={handleInputChange}
                  className="w-full h-[120px] text-[50px] sm:text-[120px] font-bold text-center bg-transparent text-main focus:outline-none appearance-none"
                  placeholder="0:00:00"
                  autoFocus
                />
                <button 
                  type="submit"
                  className=" text-acc-2 hover:text-main transition-colors"
                >
                  Press Enter to confirm
                </button>
              </form>
            ) : (
              <div className="text-center">
                <div className="text-[50px] sm:text-[120px] font-bold text-main mb-2">
                  {formatTime(time)}
                </div>
              </div>
            )}
          </div>

          
            {/* Animated container preset list */}
            <div
              className={`
                overflow-hidden
                transition-all duration-200 ease-out
                ${showPresets ? 'max-h-72 mt-2' : 'max-h-0'}
              `}
              onMouseLeave={() => setShowPresets(false)}
            >
              <div className="bg-mbg-3 rounded-lg shadow-lg py-2">
                {presets.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => handlePresetSelect(p.value)}
                    className="mt-2 rounded-full w-full border-1 px-4 py-2 text-left text-main hover:bg-mbg-2 transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

          <div className="h-px bg-acc-1 mb-8 border-white"></div>

          <div className="flex flex-col items-center gap-4">
            {/* Quick add time buttons */}
            <div className="flex gap-2 mb-4">
              {quickAddTimes.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => handleAddTime(value)}
                  className="px-4 py-2 rounded-full bg-mbg-3 text-main hover:bg-mbg-1 transition-colors text-sm"
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex justify-center align-center gap-4">
              {!isRunning ? (
                <button
                  onClick={handleStart}
                  className="px-20 rounded-full bg-main text-bg1 hover:bg-opacity-90 transition-colors"
                >
                  <IconPlayerPlay size={24} />
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="px-20 rounded-full bg-main text-bg1 hover:bg-opacity-90 transition-colors"
                >
                  <IconPlayerPause size={24} />
                </button>
              )}
              
              <button
                onClick={handleExit}
                className="px-20 rounded-full bg-red-600 text-bg1 hover:bg-red-700 transition-colors"
              >
                <IconX size={24} />
              </button>
              
              <div className='flex flex-row justify-center align-center'>
                <button
                  onMouseEnter={() => setShowPresets(true)}
                  className="text-acc-2 ml-6 hover:text-main transition-colors"
                >
                  <IconList size={32} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SessionsPage() {
  return (
    <main className="min-h-screen">
      <Timer />
    </main>
  );
}