"use client"
import React, { useState, useEffect } from 'react';
import { IconPlayerPlay, IconPlayerPause, IconList } from '@tabler/icons-react';

const Timer = () => {
  const [time, setTime] = useState(0); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [inputTime, setInputTime] = useState('');
  const [rawInput, setRawInput] = useState('');
  const [shouldStart, setShouldStart] = useState(false);

  const presets = [
    { label: '30 minutes', value: 30 * 60 },
    { label: '45 minutes', value: 45 * 60 },
    { label: '1 hour', value: 60 * 60 },
    { label: '1.5 hours', value: 90 * 60 },
    { label: '2 hours', value: 120 * 60 },
  ];

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
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
    if (time > 0) setIsRunning(true);
  };

  const handlePause = () => setIsRunning(false);

  const handleStop = () => {
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
                  className="mt-2 text-acc-2 hover:text-main transition-colors"
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

          <div className="flex justify-center align-center">
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
  );
};

export default function SessionsPage() {
  return (
    <main className="min-h-screen">
      <Timer />
    </main>
  );
}