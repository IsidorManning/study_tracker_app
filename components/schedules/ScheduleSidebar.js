"use client";

import { useState, useEffect } from 'react';
import { IconCalendar } from '@tabler/icons-react';
import SlideInSidebar from '@/components/SlideInSidebar';

const ScheduleSidebar = ({
  isOpen,
  onClose,
  onSave,
  editingSchedule,
  allTopics
}) => {
  const [formData, setFormData] = useState({
    topic_id: '',
    day_of_week: [],
    start_time: '',
    duration: 25,
    is_active: true
  });

  useEffect(() => {
    if (editingSchedule) {
      // Convert day numbers to names for the form
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const days = editingSchedule.day_of_week.map(day => dayNames[day]);
      
      setFormData({
        ...editingSchedule,
        day_of_week: days
      });
    } else {
      // Reset form when opening for new schedule
      setFormData({
        topic_id: '',
        day_of_week: [],
        start_time: '12:00', // Set a default time
        duration: 25,
        is_active: true
      });
    }
  }, [editingSchedule]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      day_of_week: prev.day_of_week.includes(day)
        ? prev.day_of_week.filter(d => d !== day)
        : [...prev.day_of_week, day]
    }));
  };

  const handleInputClick = (e) => {
    e.stopPropagation();
  };

  return (
    <SlideInSidebar
      isOpen={isOpen}
      onClose={onClose}
      title={editingSchedule ? "Edit Schedule" : "Add Schedule"}
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6" onClick={handleInputClick}>
        <div className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">
              Topic
            </label>
            <select
              value={formData.topic_id}
              onChange={(e) => setFormData(prev => ({ ...prev, topic_id: e.target.value }))}
              className="w-full p-3 rounded-lg bg-black-3 text-white border border-white/20 focus:border-pink focus:outline-none"
              required
            >
              <option value="">Select a topic</option>
              {allTopics.map(topic => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Days of Week
            </label>
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  className={`p-2 rounded-lg text-sm ${
                    formData.day_of_week.includes(day)
                      ? 'bg-pink text-white'
                      : 'bg-black-3 text-white/60 hover:text-white border border-white/20'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Start Time
            </label>
            <input
              type="time"
              value={formData.start_time}
              onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
              className="w-full p-3 rounded-lg bg-black-3 text-white border border-white/20 focus:border-pink focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
              className="w-full p-3 rounded-lg bg-black-3 text-white border border-white/20 focus:border-pink focus:outline-none"
              min="1"
              max="240"
              required
            />
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="w-full py-3 px-6 rounded-lg bg-pink text-white font-medium hover:opacity-90 transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
          >
            <IconCalendar size={20} />
            {editingSchedule ? "Update Schedule" : "Add Schedule"}
          </button>
        </div>
      </form>
    </SlideInSidebar>
  );
};

export default ScheduleSidebar;
