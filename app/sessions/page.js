"use client"
import React, { useState, useEffect } from 'react';
import { 
  IconPlayerPlay,
  IconPlayerPause,
  IconList,
  IconX,
  IconMoon,
  IconClock,
  IconBook
} from '@tabler/icons-react';
import { useTimer } from '@/lib/TimerContext';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import SessionSettingsButton from '@/components/sessions/SessionSettingsButton';
import PomodoroSettings from '@/components/sessions/PomodoroSettings';
import Celebration from '@/components/sessions/Celebration';
import CircularProgress from '@/components/sessions/CircularProgress';
import { Tooltip } from '@mui/material';

const Timer = ({ initialDuration, initialTopic }) => {
  const { user } = useAuth();
  const { 
    remainingTime, 
    isRunning, 
    formatTime, 
    startTimer, 
    pauseTimer, 
    resumeTimer, 
    handleTimerEnd,
    isBreak,
    startBreak,
    handleBreakEnd,
    isPomodoro,
    startPomodoro,
    getPomodoroStatus,
    selectedTopic,
    setSelectedTopic,
    pomodoroSettings,
    setPomodoroSettings
  } = useTimer();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [showPomodoroTooltip, setShowPomodoroTooltip] = useState(false);
  const [inputTime, setInputTime] = useState('');
  const [rawInput, setRawInput] = useState('');
  const [shouldStart, setShouldStart] = useState(false);
  const [initialTime, setInitialTime] = useState(initialDuration || 0);
  const [showTopicSelector, setShowTopicSelector] = useState(false);
  const [topics, setTopics] = useState([]);
  const [showTopicTooltip, setShowTopicTooltip] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPomodoroSettings, setShowPomodoroSettings] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTopics();
    }
  }, [user]);

  useEffect(() => {
    if (initialTopic) {
      console.log('Setting initial topic:', initialTopic);
      setSelectedTopic(initialTopic);
    }
  }, [initialTopic, setSelectedTopic]);

  useEffect(() => {
    console.log('Timer component - selectedTopic changed:', selectedTopic);
  }, [selectedTopic]);

  const fetchTopics = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('Fetched topics from database:', data);
      setTopics(data || []);
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialDuration) {
      setInitialTime(initialDuration);
      startTimer(initialDuration);
    }
  }, [initialDuration]);

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
    if (remainingTime > 0) {
      console.log('Starting timer with topic:', selectedTopic);
      console.log('Topic ID type:', typeof selectedTopic?.id);
      console.log('Topic ID value:', selectedTopic?.id);
      console.log('Topic ID string representation:', String(selectedTopic?.id));
      setInitialTime(remainingTime);
      startTimer(remainingTime);
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
      pauseTimer();
      const newTime = remainingTime + seconds;
      setInitialTime(newTime);
      startTimer(newTime);
    } else {
      const newTime = remainingTime + seconds;
      setInitialTime(newTime);
      startTimer(newTime);
    }
  };

  const handleExit = () => {
    handleTimerEnd(true);
    setShowCelebration(true);
  };

  // Add effect to show celebration when timer naturally ends
  useEffect(() => {
    if (remainingTime === 0 && initialTime > 0 && !isBreak && !isPomodoro) {
      setShowCelebration(true);
    }
  }, [remainingTime, initialTime, isBreak, isPomodoro]);

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
    return ((initialTime - remainingTime) / initialTime) * 100;
  };

  const handleBreakToggle = () => {
    if (isBreak) {
      handleBreakEnd();
    } else {
      startBreak();
    }
  };

  const pomodoroStatus = getPomodoroStatus();

  const handleTopicSelect = (topic) => {
    if (!topic || !topic.topic_id) {
      console.error('Invalid topic selected:', topic);
      return;
    }

    // Ensure we're using the full topic object with string ID
    const selectedTopic = {
      id: String(topic.topic_id), // Use topic_id instead of id
      name: topic.name,
      field: topic.field,
      description: topic.description,
      status: topic.status,
      theoretical: topic.theoretical,
      practical: topic.practical,
      problem_solving: topic.problem_solving,
      recent_practice: topic.recent_practice
    };
    
    setSelectedTopic(selectedTopic);
    setShowTopicSelector(false);
  };

  const pomodoroTooltip = (
    <>
      <h3 className="text-white font-bold mb-2">Pomodoro Technique</h3>
      <p className="text-gray-300 text-sm">
        A 2-hour session with:
        <br />• 4 study blocks (25 min each)
        <br />• 3 short breaks (5 min each)
        <br />• 1 long break (15 min)
      </p>
    </>
  );

  const presetsDropdown = (
    <div className="bg-black rounded-lg shadow-lg py-2 min-w-[200px]">
      <div className="px-4 py-2 border-b border-black">
        <h3 className="text-white font-bold">Select Duration</h3>
        <p className="text-gray-300 text-sm">
          Choose a preset duration for your study session
        </p>
      </div>
      <div className="max-h-[300px] overflow-y-auto">
        {presets.map((p) => (
          <button
            key={p.value}
            onClick={() => handlePresetSelect(p.value)}
            className="w-full px-4 py-2 text-left text-white hover:bg-black transition-all duration-200 ease-in-out hover:brightness-[0.70] cursor-pointer"
          >
            <div className="font-medium">{p.label}</div>
          </button>
        ))}
      </div>
    </div>
  );

  const topicDropdown = (
    <div className="bg-black rounded-lg shadow-lg py-2 min-w-[200px]">
      <div className="px-4 py-2 border-b border-black">
        <h3 className="text-white font-bold">Select Topic</h3>
        <p className="text-gray-300 text-sm">
          Choose a topic to track your study session
        </p>
      </div>
      <div className="max-h-[300px] overflow-y-auto">
        {loading ? (
          <div className="px-4 py-2 text-white/60 text-center">
            Loading topics...
          </div>
        ) : topics.length === 0 ? (
          <div className="px-4 py-2 text-white/60 text-center">
            No topics found
          </div>
        ) : (
          topics.map((topic) => {
            console.log('Rendering topic in dropdown:', topic);
            return (
              <button
                key={topic.id}
                onClick={() => {
                  console.log('Topic clicked in dropdown:', topic);
                  handleTopicSelect(topic);
                }}
                className="w-full px-4 py-2 text-left text-white hover:bg-black transition-all duration-200 ease-in-out hover:brightness-[0.70] cursor-pointer"
              >
                <div className="font-medium">{topic.name}</div>
                <div className="text-sm text-white/60">{topic.field}</div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );

  const handlePomodoroSettingsChange = (newSettings) => {
    setPomodoroSettings(newSettings);
  };

  const handleStartPomodoro = async () => {
    if (!selectedTopic) {
      alert('Please select a topic before starting a Pomodoro session');
      return;
    }
    try {
      await startPomodoro(pomodoroSettings);
      setShowPomodoroSettings(false);
    } catch (error) {
      console.error('Error starting Pomodoro:', error);
      alert('Failed to start Pomodoro session. Please try again.');
    }
  };

  const handlePomodoroClick = () => {
    if (!isPomodoro) {
      setShowPomodoroSettings(true);
    } else {
      handleTimerEnd(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center bg-black justify-center p-4">
      <div className="w-[80vw] p-6 xl:w-[60vw] rounded-mg sm:rounded-sm xl:rounded-full h-full">
        <div className="bg-black rounded-3xl p-8 shadow-lg flex flex-col items-center ml-8">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-white">
              {isPomodoro 
                ? `Pomodoro ${pomodoroStatus?.cycle}/${pomodoroStatus?.totalCycles} - ${pomodoroStatus?.isStudy ? 'Study' : pomodoroStatus?.isLongBreak ? 'Long Break' : 'Short Break'}`
                : isBreak 
                  ? 'Break Time' 
                  : 'Study Time'}
            </h2>
            {selectedTopic && (
              <p className="text-white/80 mt-2">Studying: {selectedTopic.name}</p>
            )}
          </div>

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
                  isBreak={isBreak}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-[50px] sm:text-[70px] md:text-[80px] xl:text-[100px] font-bold text-white">
                    {formatTime(remainingTime)}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="h-px bg-black mb-8 border-white"></div>

          <div className="flex flex-col items-center gap-4">
            {!isBreak && !isPomodoro && (
              <div className="flex gap-2 mb-4">
                {quickAddTimes.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => handleAddTime(value)}
                    className="px-4 py-2 rounded-full bg-black text-white hover:bg-black transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer text-sm"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            <div className="flex justify-center items-center gap-4 relative">
              {!isRunning ? (
                <button
                  onClick={handleStart}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-[#CEABB1] to-[#7DCEA0] text-bg1 hover:opacity-90 transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer flex items-center justify-center"
                >
                  <IconPlayerPlay size={24} />
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-[#CEABB1] to-[#7DCEA0] text-bg1 hover:opacity-90 transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer flex items-center justify-center"
                >
                  <IconPlayerPause size={24} />
                </button>
              )}
              
              <button
                onClick={handleBreakToggle}
                className={`w-12 h-12 rounded-full transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer flex items-center justify-center ${
                  isBreak 
                    ? 'bg-gradient-to-r from-[#4A90E2] to-[#9B51E0]' 
                    : 'bg-black hover:bg-black'
                }`}
              >
                <IconMoon size={24} className="text-white" />
              </button>

              <button
                onClick={handleExit}
                className="w-12 h-12 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer flex items-center justify-center"
              >
                <IconX size={24} />
              </button>

              {!isBreak && !isPomodoro && (
                <>
                  <Tooltip title="Start a Pomodoro session">
                    <button
                      onClick={handlePomodoroClick}
                      className="w-auto px-4 h-12 rounded-full bg-black text-white hover:bg-black transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <IconClock size={24} />
                      <span className="text-sm">Pomodoro</span>
                    </button>
                  </Tooltip>

                  <SessionSettingsButton
                    icon={IconList}
                    showDropdown={showPresets}
                    onMouseEnter={() => setShowPresets(true)}
                    onMouseLeave={() => setShowPresets(false)}
                    dropdownContent={presetsDropdown}
                  />

                  <SessionSettingsButton
                    icon={IconBook}
                    showDropdown={showTopicSelector}
                    onMouseEnter={() => setShowTopicSelector(true)}
                    onMouseLeave={() => setShowTopicSelector(false)}
                    dropdownContent={topicDropdown}
                    alignLeft={true}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pomodoro Settings Sidebar */}
      {showPomodoroSettings && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowPomodoroSettings(false)}
        >
          <PomodoroSettings
            isOpen={showPomodoroSettings}
            onClose={() => setShowPomodoroSettings(false)}
            settings={pomodoroSettings}
            onSettingsChange={handlePomodoroSettingsChange}
            onStart={handleStartPomodoro}
          />
        </div>
      )}

      {showCelebration && (
        <Celebration
          isVisible={showCelebration}
          onClose={() => setShowCelebration(false)}
          duration={initialTime - remainingTime}
        />
      )}
    </div>
  );
};

export default function SessionsPage() {
  const [initialDuration, setInitialDuration] = useState(null);
  const [initialTopic, setInitialTopic] = useState(null);
  const { user } = useAuth();

  // Handle navigation from schedules
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const duration = params.get('duration');
    const topicId = params.get('topicId');
    
    if (duration) {
      setInitialDuration(parseInt(duration) * 60); // Convert minutes to seconds
    }
    
    if (topicId && user) {
      // Fetch topic details from Supabase
      const fetchTopic = async () => {
        try {
          const { data, error } = await supabase
            .from('topics')
            .select('*')
            .eq('id', topicId)
            .eq('user_id', user.id)
            .single();

          if (error) throw error;
          setInitialTopic(data);
        } catch (error) {
          console.error('Error fetching topic:', error);
        }
      };
      fetchTopic();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-black">
      <Timer initialDuration={initialDuration} initialTopic={initialTopic} />
    </div>
  );
}