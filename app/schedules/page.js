"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { IconPlus, IconClock, IconBook, IconTarget, IconHistory } from '@tabler/icons-react';
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

const QuickTemplate = ({ title, duration, icon: Icon, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 p-4 bg-black-2 rounded-lg hover:bg-black-3 transition-all duration-200"
  >
    <div className="p-2 bg-pink/10 rounded-lg">
      <Icon size={24} className="text-pink" />
    </div>
    <div className="text-left">
      <h3 className="text-white font-medium">{title}</h3>
      <p className="text-white/60 text-sm">{duration} minutes</p>
    </div>
  </button>
);

const RecentSession = ({ session, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 p-4 bg-black-2 rounded-lg hover:bg-black-3 transition-all duration-200"
  >
    <div className="p-2 bg-pink/10 rounded-lg">
      <IconBook size={24} className="text-pink" />
    </div>
    <div className="text-left flex-1">
      <h3 className="text-white font-medium">{session.topic_name}</h3>
      <p className="text-white/60 text-sm">
        {new Date(session.created_at).toLocaleDateString()} • {Math.floor(session.duration / 60)} minutes
      </p>
    </div>
  </button>
);

const TopicCard = ({ topic, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 p-4 bg-black-2 rounded-lg hover:bg-black-3 transition-all duration-200"
  >
    <div className="p-2 bg-pink/10 rounded-lg">
      <IconBook size={24} className="text-pink" />
    </div>
    <div className="text-left flex-1">
      <h3 className="text-white font-medium">{topic.name}</h3>
      <p className="text-white/60 text-sm">{topic.field}</p>
    </div>
    <div className="text-pink text-sm">
      {Math.floor(topic.total_study_time / 60)}h
    </div>
  </button>
);

export default function SchedulesPage() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingSchedule, setEditingSchedule] = useState(null); // State to hold the schedule being edited
  const [allTopics, setAllTopics] = useState([]); // State to hold all topics
  const [useDummyData, setUseDummyData] = useState(true); // Toggle for dummy data
  const router = useRouter(); // Initialize useRouter
  const [recentSessions, setRecentSessions] = useState([]);
  const [topics, setTopics] = useState([]);

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
        fetchRecentSessions();
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

  const fetchRecentSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          topics (
            name
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentSessions(data.map(session => ({
        ...session,
        topic_name: session.topics?.name || 'No Topic'
      })));
    } catch (error) {
      console.error('Error fetching recent sessions:', error);
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

  const startSession = (duration, topicId = null) => {
    const params = new URLSearchParams();
    if (duration) params.set('duration', duration);
    if (topicId) params.set('topicId', topicId);
    router.push(`/sessions?${params.toString()}`);
  };

  const quickTemplates = [
    { title: 'Quick Focus', duration: 25, icon: IconClock },
    { title: 'Deep Work', duration: 120, icon: IconTarget },
    { title: 'Review Session', duration: 45, icon: IconBook },
  ];

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

      <div className="max-w-4xl mx-auto space-y-8 mt-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-4">Quick Start</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickTemplates.map((template) => (
              <QuickTemplate
                key={template.title}
                {...template}
                onClick={() => startSession(template.duration)}
              />
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white mb-4">Recent Sessions</h1>
          <div className="space-y-4">
            {recentSessions.map((session) => (
              <RecentSession
                key={session.id}
                session={session}
                onClick={() => startSession(session.duration, session.topic_id)}
              />
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white mb-4">Your Topics</h1>
          <div className="space-y-4">
            {topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onClick={() => startSession(25, topic.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
} 