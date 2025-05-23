"use client";

import { useState } from 'react';
import { IconClock, IconX, IconInfoCircle, IconPlay } from '@tabler/icons-react';
import { Tooltip, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';

const PomodoroSettings = ({ isOpen, onClose, settings, onSettingsChange, onStart }) => {
  const [activeTab, setActiveTab] = useState('settings');

  const handleChange = (field, value) => {
    onSettingsChange({
      ...settings,
      [field]: value
    });
  };

  return (
    <div className={`fixed right-0 top-0 h-full w-96 bg-black-2 shadow-lg transform transition-transform duration-300 ease-in-out border-l border-white/10 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <IconClock size={24} className="text-pink" />
            <h2 className="text-xl font-bold text-white">Pomodoro</h2>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <IconX size={24} />
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <Tooltip title="Settings">
            <IconButton 
              onClick={() => setActiveTab('settings')}
              className={`${activeTab === 'settings' ? 'text-pink' : 'text-white/60 hover:text-white'}`}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="About Pomodoro">
            <IconButton 
              onClick={() => setActiveTab('info')}
              className={`${activeTab === 'info' ? 'text-pink' : 'text-white/60 hover:text-white'}`}
            >
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'settings' ? (
            <div className="space-y-6">
              <div>
                <label className="block text-white/80 mb-2">Study Duration (minutes)</label>
                <input
                  type="number"
                  value={settings.studyDuration / 60}
                  onChange={(e) => handleChange('studyDuration', parseInt(e.target.value) * 60)}
                  min="1"
                  max="60"
                  className="w-full bg-black-3 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink"
                />
              </div>

              <div>
                <label className="block text-white/80 mb-2">Short Break Duration (minutes)</label>
                <input
                  type="number"
                  value={settings.shortBreakDuration / 60}
                  onChange={(e) => handleChange('shortBreakDuration', parseInt(e.target.value) * 60)}
                  min="1"
                  max="15"
                  className="w-full bg-black-3 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink"
                />
              </div>

              <div>
                <label className="block text-white/80 mb-2">Long Break Duration (minutes)</label>
                <input
                  type="number"
                  value={settings.longBreakDuration / 60}
                  onChange={(e) => handleChange('longBreakDuration', parseInt(e.target.value) * 60)}
                  min="1"
                  max="30"
                  className="w-full bg-black-3 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink"
                />
              </div>

              <div>
                <label className="block text-white/80 mb-2">Number of Cycles</label>
                <input
                  type="number"
                  value={settings.cycles}
                  onChange={(e) => handleChange('cycles', parseInt(e.target.value))}
                  min="1"
                  max="10"
                  className="w-full bg-black-3 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink"
                />
              </div>

              <button
                onClick={() => {
                  handleChange('studyDuration', 25 * 60);
                  handleChange('shortBreakDuration', 5 * 60);
                  handleChange('longBreakDuration', 15 * 60);
                  handleChange('cycles', 4);
                }}
                className="w-full py-2 bg-black-3 text-white rounded-lg hover:bg-black-1 transition-colors"
              >
                Reset to Default (25/5/15)
              </button>
            </div>
          ) : (
            <div className="space-y-6 text-white/80">
              <div className="bg-black-3 p-4 rounded-lg">
                <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                  <IconInfoCircle size={20} />
                  What is the Pomodoro Technique?
                </h3>
                <p className="mb-4">
                  The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. It uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks.
                </p>
                <h4 className="text-white font-bold mb-2">Benefits:</h4>
                <ul className="list-disc list-inside space-y-2">
                  <li>Improves focus and concentration</li>
                  <li>Reduces mental fatigue</li>
                  <li>Helps maintain motivation</li>
                  <li>Prevents burnout</li>
                  <li>Increases productivity</li>
                </ul>
              </div>

              <div className="bg-black-3 p-4 rounded-lg">
                <h3 className="text-white font-bold mb-2">How to Use:</h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Choose a task to work on</li>
                  <li>Set the timer for 25 minutes (or your preferred duration)</li>
                  <li>Work on the task until the timer rings</li>
                  <li>Take a short 5-minute break</li>
                  <li>After four cycles, take a longer 15-minute break</li>
                </ol>
              </div>

              <div className="bg-black-3 p-4 rounded-lg">
                <h3 className="text-white font-bold mb-2">Tips for Success:</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Eliminate distractions during study sessions</li>
                  <li>Use breaks for physical movement</li>
                  <li>Stay consistent with the technique</li>
                  <li>Adjust durations based on your needs</li>
                  <li>Track your progress and adjust accordingly</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          <button
            onClick={onStart}
            className="w-full py-3 bg-gradient-to-r from-[#CEABB1] to-[#7DCEA0] text-white rounded-lg hover:opacity-90 transition-all duration-200 ease-in-out flex items-center justify-center gap-2"
          >
            <PlayArrowIcon />
            Start Pomodoro Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default PomodoroSettings; 