"use client"
import React, { useState, useEffect } from 'react';
import { IconPlayerPlay, IconPlayerPause, IconList, IconX } from '@tabler/icons-react';
import { useTimer } from '@/lib/TimerContext';

const CircularProgress = ({ progress, size = 400, strokeWidth = 12 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          className="text-black"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle with gradient */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#CEABB1" />
            <stop offset="100%" stopColor="#7DCEA0" />
          </linearGradient>
        </defs>
        <circle
          className="transition-all duration-1000 ease-linear"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
    </div>
  );
};

const Timer = () => {
  const { 
    time, 
    isRunning, 
    formatTime, 
    startTimer, 
    pauseTimer, 
    resumeTimer, 
    handleSessionEnd 
  } = useTimer();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [inputTime, setInputTime] = useState('');
  const [rawInput, setRawInput] = useState('');
  const [shouldStart, setShouldStart] = useState(false);
  const [initialTime, setInitialTime] = useState(0);

  useEffect(() => {
    if (time > 0 && initialTime === 0) {
      setInitialTime(time);
    }
  }, [time, initialTime]);

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

  const handleStart = () => {
    if (time > 0) {
      setInitialTime(time);
      startTimer(time);
    }
  };

  const handlePause = () => {
    pauseTimer();
  };

  const handleResume = () => {
    resumeTimer();
  };

  const handleAddTime = (seconds) => {
    if (isRunning) {
      // If timer is running, we need to pause, update time, and resume
      pauseTimer();
      const newTime = time + seconds;
      setInitialTime(newTime);
      startTimer(newTime);
    } else {
      // If timer is not running, just update the time
      const newTime = time + seconds;
      setInitialTime(newTime);
      startTimer(newTime);
    }
  };

  const handleExit = () => {
    handleSessionEnd(true);
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
  
    raw = raw.slice(-6);
    const padded = raw.padStart(6, '0');
  
    const hours = String(parseInt(padded.slice(0, 2), 10));
    const minutes = padded.slice(2, 4);
    const seconds = padded.slice(4, 6);
  
    const formatted = `${hours}:${minutes}:${seconds}`;
    setInputTime(formatted);
  };

  const handleTimeSubmit = (e) => {
    e.preventDefault();
    
    if (!rawInput) {
      setIsEditing(false);
      return;
    }

    const parts = inputTime.split(':').map(Number);
    
    if (parts.some(isNaN)) {
      alert('Invalid format');
      return;
    }

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
      setInitialTime(total);
      startTimer(total);
      setIsEditing(false);
    }
  };

  const handlePresetSelect = (sec) => {
    setInitialTime(sec);
    startTimer(sec);
    setShowPresets(false);
    setIsEditing(false);
  };

  const calculateProgress = () => {
    if (!initialTime || initialTime === 0) return 0;
    return ((initialTime - time) / initialTime) * 100;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-[80vw] p-6 xl:w-[60vw] rounded-mg sm:rounded-sm xl:rounded-full h-full">
        <div className="bg-black-2 rounded-3xl p-8 shadow-lg flex flex-col items-center ml-8">
          <div className="relative flex items-center justify-center" onClick={handleTimerClickEvent}>
            {isEditing ? (
              <form onSubmit={handleTimeSubmit} className="text-center">
                <input
                  type="text"
                  value={inputTime}
                  onChange={handleInputChange}
                  className="w-full h-[120px] text-[50px] sm:text-[70px] md:text-[80px] xl:text-[100px] font-bold text-center bg-transparent text-white focus:outline-none appearance-none"
                  placeholder="0:00:00"
                  autoFocus
                />
                <button 
                  type="submit"
                  className="text-pink hover:text-white transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer"
                >
                  Press Enter to confirm
                </button>
              </form>
            ) : (
              <div className="text-center relative">
                <CircularProgress 
                  progress={calculateProgress()} 
                  size={500}
                  strokeWidth={16}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-[50px] sm:text-[70px] md:text-[80px] xl:text-[100px] font-bold text-white">
                    {formatTime(time)}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="h-px bg-black mb-8 border-white"></div>

          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-2 mb-4">
              {quickAddTimes.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => handleAddTime(value)}
                  className="px-4 py-2 rounded-full bg-black-3 text-white hover:bg-black-1 transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer text-sm"
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex justify-center items-center gap-4 relative">
              {!isRunning ? (
                <button
                  onClick={handleStart}
                  className="px-20 rounded-full bg-gradient-to-r from-[#CEABB1] to-[#7DCEA0] text-bg1 hover:opacity-90 transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer"
                >
                  <IconPlayerPlay size={24} />
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="px-20 rounded-full bg-gradient-to-r from-[#CEABB1] to-[#7DCEA0] text-bg1 hover:opacity-90 transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer"
                >
                  <IconPlayerPause size={24} />
                </button>
              )}
              
              <button
                onClick={handleExit}
                className="px-20 rounded-full bg-red-600 text-bg1 hover:bg-red-700 transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer"
              >
                <IconX size={24} />
              </button>

              <div className="relative ml-4">
                <button
                  onMouseEnter={() => setShowPresets(true)}
                  className="text-pink hover:text-white transition-all duration-200 ease-in-out hover:scale-110 cursor-pointer"
                >
                  <IconList size={32} />
                </button>
                
                <div
                  className={`
                    absolute right-0 bottom-full mb-2
                    overflow-hidden bg-black p-2 rounded-lg
                    transition-all duration-200 ease-out
                    ${showPresets ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'}
                  `}
                  onMouseLeave={() => setShowPresets(false)}
                >
                  <div className="bg-black-3 rounded-lg shadow-lg py-2">
                    {presets.map((p) => (
                      <button
                        key={p.value}
                        onClick={() => handlePresetSelect(p.value)}
                        className="w-48 mt-2 rounded-full border-1 px-4 py-2 text-left text-white hover:bg-black-2 transition-all duration-200 ease-in-out hover:brightness-[0.70] cursor-pointer"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
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