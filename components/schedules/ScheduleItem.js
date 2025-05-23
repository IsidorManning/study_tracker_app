"use client";

import React from 'react';
import { IconClock, IconCalendarDue } from '@tabler/icons-react'; // Import icons for time and days
import { useRouter } from 'next/navigation';

const ScheduleItem = ({ schedule, topics, onUpdate, onDelete, onStartSession }) => {
  const router = useRouter();

  // Helper to format the days of the week
  const formatDays = (daysArray) => {
    // Convert numeric days (0-6) back to names for display
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const formattedNames = daysArray.map(dayIndex => dayNames[dayIndex]);
    // Sort days according to the standard order (Sunday-Saturday) for consistent display
    const orderedDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const sortedDays = formattedNames.sort((a, b) => orderedDays.indexOf(a) - orderedDays.indexOf(b));
    return sortedDays.join(', ');
  };

  const handleStartSession = () => {
    const topic = topics.find(topic => topic.id === schedule.topic_id);
    if (topic) {
      router.push(`/sessions?duration=${schedule.duration}&topicId=${topic.id}`);
    }
  };

  return (
    <div className="bg-black-2 rounded-lg border border-acc-1 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div className="mb-4 sm:mb-0">
        {/* Display Topic Name */}
        <h3 className="text-lg font-semibold text-white">{topics.find(topic => topic.id === schedule.topic_id)?.name || 'Unknown Topic'}</h3>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 text-white/80 text-sm">
           {/* Display Days of Week */}
          <div className="flex items-center gap-1">
            <IconCalendarDue size={16} className="text-white/60" />
            <span>{formatDays(schedule.day_of_week)}</span>
          </div>
          
          {/* Display Time and Duration */}
          <div className="flex items-center gap-1">
            <IconClock size={16} className="text-white/60" />
            <span>{schedule.start_time} ({schedule.duration} mins)</span>
          </div>
        </div>
      </div>
      
      {/* Edit/Delete buttons */}
      <div className="flex gap-2">
        {/* Add Start Session button */}
        <button
          className="px-3 py-1 bg-pink text-white rounded-lg hover:bg-pink/80 transition-colors"
          onClick={handleStartSession}
        >
          Start Session
        </button>
        <button
          className="px-3 py-1 border border-white/40 text-white/60 rounded-lg hover:border-white hover:text-white transition-colors"
          onClick={() => onUpdate(schedule)}
        >
          Edit
        </button>
        <button
          className="px-3 py-1 border border-red-400 text-red-400 rounded-lg hover:border-red-600 hover:text-red-600 transition-colors"
          onClick={() => onDelete(schedule.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ScheduleItem; 