"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { IconPlus } from '@tabler/icons-react';
import { Tooltip } from '@mui/material';
// We will create this component next
import ScheduleSidebar from '@/components/schedules/ScheduleSidebar';
import ScheduleItem from '@/components/schedules/ScheduleItem';
import { useRouter } from 'next/navigation';

// Define dummy data
const DUMMY_TOPICS_FOR_SCHEDULES = [
  { id: 'dummy-topic-1', name: 'Dummy Math' },
  { id: 'dummy-topic-2', name: 'Dummy Physics' },
  { id: 'dummy-topic-3', name: 'Dummy CS' },
];

const DUMMY_SCHEDULES = [
  {
    id: 'dummy-schedule-1',
    user_id: 'dummy-user-id', // Use a consistent dummy user ID
    topic_id: 'dummy-topic-1',
    day_of_week: [1, 3, 5], // Monday, Wednesday, Friday
    start_time: '09:00',
    duration: 60,
    is_active: true,
    // Include nested topics object for consistency with real data fetch structure
    topics: { name: 'Dummy Math' }
  },
  {
    id: 'dummy-schedule-2',
    user_id: 'dummy-user-id',
    topic_id: 'dummy-topic-2',
    day_of_week: [2, 4], // Tuesday, Thursday
    start_time: '14:30',
    duration: 90,
    is_active: true,
    topics: { name: 'Dummy Physics' }
  },
  {
    id: 'dummy-schedule-3',
    user_id: 'dummy-user-id',
    topic_id: 'dummy-topic-3',
    day_of_week: [0, 6], // Sunday, Saturday
    start_time: '19:00',
    duration: 45,
    is_active: true,
    topics: { name: 'Dummy CS' }
  },
];

export default function SchedulesPage() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingSchedule, setEditingSchedule] = useState(null); // State to hold the schedule being edited
  const [allTopics, setAllTopics] = useState([]); // State to hold all topics
  const [useDummyData, setUseDummyData] = useState(true); // Toggle for dummy data
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    // Fetch data when the user is available or dummy data is toggled
    if (useDummyData) {
      setSchedules(DUMMY_SCHEDULES);
      setAllTopics(DUMMY_TOPICS_FOR_SCHEDULES); // Use dummy topics for sidebar dropdown
      setLoading(false);
    } else {
      if (user) {
        fetchSchedules();
        fetchAllTopics(); // Fetch all topics here as well
      } else {
        setLoading(false);
      }
    }
  }, [user, useDummyData]); // Depend on user and useDummyData

  const fetchAllTopics = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('topics')
        .select('id, name')
        .eq('user_id', user.id);

      if (error) throw error;
      setAllTopics(data || []);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      // Assuming we have a 'study_schedules' table as planned
      const { data, error } = await supabase
        .from('study_schedules')
        .select('*') // Changed back to select all from schedules
        .eq('user_id', user.id)
        .order('start_time', { ascending: true });

      if (error) throw error;
      setSchedules(data || []);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setSchedules([]); // Clear schedules on error
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSchedule = async (scheduleData) => {
    try {
      // Add user_id and potentially other default values
      const scheduleToSave = {
        ...scheduleData,
        user_id: user.id,
        // Convert day names to numbers (0 for Sunday, 1 for Monday, etc.)
        day_of_week: scheduleData.day_of_week.map(day => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day)),
      };

      if (editingSchedule) {
        // Update existing schedule
        const { error } = await supabase
          .from('study_schedules')
          .update(scheduleToSave)
          .eq('id', editingSchedule.id)
          .eq('user_id', user.id);

        if (error) throw error;
        setEditingSchedule(null); // Clear editing state
      } else {
        // Insert new schedule
        const { error } = await supabase
          .from('study_schedules')
          .insert([scheduleToSave]);

        if (error) throw error;
      }

      setIsSidebarOpen(false);
      fetchSchedules(); // Refresh the list after saving/updating
    } catch (error) {
      console.error('Error saving schedule:', error);
      // Optionally show an error message to the user
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      const { error } = await supabase
        .from('study_schedules')
        .delete()
        .eq('id', scheduleId)
        .eq('user_id', user.id); // Ensure users can only delete their own schedules

      if (error) throw error;
      fetchSchedules(); // Refresh the list after deleting
    } catch (error) {
      console.error('Error deleting schedule:', error);
      // Optionally show an error message to the user
    }
  };

  // Function to handle editing a schedule - opens the sidebar and sets the editingSchedule state
  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule);
    setIsSidebarOpen(true);
  };

  // Function to handle starting a session from a schedule
  const handleStartSession = (schedule) => {
    console.log('Starting session for schedule:', schedule);
    // Navigate to the timer/sessions page with topicId and duration
    router.push(`/sessions?topicId=${schedule.topic_id}&duration=${schedule.duration}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading Schedules...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-10 xl:p-40">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Study Schedules</h1>
          <p className="text-white/60">
            Plan your study time for different topics
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Toggle button for dummy data */}
          <Tooltip title="Toggle dummy data" placement="left">
            <button
              onClick={() => setUseDummyData(!useDummyData)}
              className="p-2 rounded-lg hover:bg-black-3 transition-colors text-white"
            >
              {useDummyData ? 'Using Dummy Data' : 'Using Real Data'}
            </button>
          </Tooltip>
          {/* Button to open the sidebar */}
          <Tooltip title="Add new schedule" placement="left">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-black-3 transition-colors"
            >
              <IconPlus size={24} className="text-white" />
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="space-y-4">
        {/* Placeholder for displaying schedules */}
        {schedules.length === 0 ? (
          <div className="text-white/60 text-center py-10">
            No schedules added yet. Click the &quot;+&quot; button to add one.
          </div>
        ) : (
          // Map over schedules and display them (we'll add this part later)
          <div className="space-y-4">
            {schedules.map(schedule => (
              <ScheduleItem
                key={schedule.id}
                schedule={schedule}
                topics={allTopics} // Pass all topics down
                onUpdate={handleEditSchedule}
                onDelete={handleDeleteSchedule}
                onStartSession={handleStartSession} // Pass the handleStartSession function
              />
            ))}
          </div>
        )}
      </div>

      {/* ScheduleSidebar component (will be added next) */}
      <ScheduleSidebar
        isOpen={isSidebarOpen}
        onClose={() => { setIsSidebarOpen(false); setEditingSchedule(null); }} // Clear editing state on close
        onSave={handleSaveSchedule}
        editingSchedule={editingSchedule}
        allTopics={allTopics} // Pass all topics down
      />
    </main>
  );
} 