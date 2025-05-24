"use client";

import { useState, useEffect } from 'react';
import { IconClock, IconX, IconInfoCircle, IconPlay } from '@tabler/icons-react';
import { Tooltip, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';
import { motion, AnimatePresence } from 'framer-motion';
import SlideInSidebar from '@/components/SlideInSidebar';

const PomodoroSettings = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  onStart
}) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [activeTab, setActiveTab] = useState('settings');

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (field, value) => {
    const newSettings = { ...localSettings, [field]: value };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onStart();
  };

  const handleInputClick = (e) => {
    e.stopPropagation();
  };

  return (
    <SlideInSidebar
      isOpen={isOpen}
      onClose={onClose}
      title="Pomodoro Settings"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6" onClick={handleInputClick}>
        <div className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">
              Study Duration (minutes)
            </label>
            <input
              type="number"
              value={localSettings.studyDuration}
              onChange={(e) => handleChange('studyDuration', parseInt(e.target.value))}
              className="w-full p-3 rounded-lg bg-black-3 text-white border border-white/20 focus:border-pink focus:outline-none"
              min="1"
              max="60"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Short Break Duration (minutes)
            </label>
            <input
              type="number"
              value={localSettings.shortBreakDuration}
              onChange={(e) => handleChange('shortBreakDuration', parseInt(e.target.value))}
              className="w-full p-3 rounded-lg bg-black-3 text-white border border-white/20 focus:border-pink focus:outline-none"
              min="1"
              max="30"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Long Break Duration (minutes)
            </label>
            <input
              type="number"
              value={localSettings.longBreakDuration}
              onChange={(e) => handleChange('longBreakDuration', parseInt(e.target.value))}
              className="w-full p-3 rounded-lg bg-black-3 text-white border border-white/20 focus:border-pink focus:outline-none"
              min="1"
              max="60"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Number of Cycles
            </label>
            <input
              type="number"
              value={localSettings.cycles}
              onChange={(e) => handleChange('cycles', parseInt(e.target.value))}
              className="w-full p-3 rounded-lg bg-black-3 text-white border border-white/20 focus:border-pink focus:outline-none"
              min="1"
              max="10"
            />
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="w-full py-3 px-6 rounded-lg bg-pink text-white font-medium hover:opacity-90 transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
          >
            <IconClock size={20} />
            Start Pomodoro Session
          </button>
        </div>
      </form>
    </SlideInSidebar>
  );
};

export default PomodoroSettings; 