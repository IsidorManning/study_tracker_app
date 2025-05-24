"use client"
import React, { useState, useEffect } from 'react';
import {
  IconFlame,
} from "@tabler/icons-react"
import Link from 'next/link';
import UnderlineLink from '@/components/animations/UnderlineLink';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useTimer } from '@/lib/TimerContext';

const DashboardCard = ({ title, description, href, icon }) => (
  <Link href={href} className="group block">
    <div className="h-full p-6 rounded-lg border border-white bg-black hover:bg-black transition-all duration-300 transform hover:scale-[1.02]">
      <div className="flex flex-col h-full">
        <div className="mb-4 text-pink-3 text-[50px] group-hover:text-white transition-colors duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-pink">{title}</h3>
        <p className="text-white transition-colors duration-300">{description}</p>
      </div>
    </div>
  </Link>
);

const TotalStudyTime = ({ totalSeconds, currentSessionTime, isRunning, formatTime, isBreak }) => {
  const formatStudyTimeReadable = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const timeParts = []; // [hours, minutes, seconds]
    if (hours > 0) timeParts.push(`${hours} hour${hours === 1 ? '' : 's'}`);
    if (minutes > 0) timeParts.push(`${minutes} minute${minutes === 1 ? '' : 's'}`);
    if (secs > 0) timeParts.push(`${secs} second${secs === 1 ? '' : 's'}`);

    if (timeParts.length === 0) return "0 seconds";

    if (timeParts.length === 1) return timeParts[0];
    if (timeParts.length === 2) return `${timeParts[0]} and ${timeParts[1]}`;
    return `${timeParts[0]}, ${timeParts[1]}, and ${timeParts[2]}`;
  };

  return (
    <div className="bg-black rounded-lg p-6 border border-white mb-8">
      <div className="flex justify-between items-center">
        <p className="text-2xl text-white">
          <span className="text-pink font-semibold">{formatStudyTimeReadable(totalSeconds)}</span> of being curious
        </p>
        {isRunning && (
          <UnderlineLink href="/sessions" className="text-xl text-white hover:text-pink transition-colors duration-200">
            {isBreak ? 'Break' : 'Current session'}: <span className="text-pink font-semibold">{formatTime(currentSessionTime)}</span>
          </UnderlineLink>
        )}
      </div>
    </div>
  );
};

const StreakDisplay = ({ currentStreak, longestStreak }) => (
  <div className="flex items-center gap-6">
    <div className="relative w-[120px] h-[120px] flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center">
        <IconFlame className="w-[120px] h-[120px] text-orange-500 animate-pulse" />
      </div>
      <div className="relative z-10 text-3xl font-bold text-white">
        {currentStreak}
      </div>
    </div>
    <div className="flex flex-col">
      <div className="text-white text-lg">Current Streak</div>
      <div className="text-white/60 text-sm">Best: {longestStreak} days</div>
      <div className="text-white/60 text-sm mt-1">
        {currentStreak > 0 ? "Keep it up! 🔥" : "Start your streak today!"}
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const username = user?.user_metadata?.username || 'there';
  const { 
    time, 
    isRunning, 
    totalStudyTime: currentSessionTotalTime, 
    formatTime, 
    isBreak 
  } = useTimer();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        // Fetch total study time
        const { data: sessions, error: sessionsError } = await supabase
          .from('study_sessions')
          .select('total_seconds')
          .eq('user_id', user.id);

        if (sessionsError) throw sessionsError;
        
        // Get the total number of seconds studied for all sessions; 
        // start at 0, loop through each session, and for each, add up the total seconds
        // for that sesh in sum.
        const total = sessions.reduce((sum, session) => sum + session.total_seconds, 0);
        setTotalStudyTime(total);

        // Fetch streak data
        const { data: streakData, error: streakError } = await supabase
          .from('user_streaks')
          .select('current_streak, longest_streak')
          .eq('user_id', user.id)
          .maybeSingle();

        if (streakError && streakError.code !== 'PGRST116') throw streakError;

        setCurrentStreak(streakData?.current_streak || 0);
        setLongestStreak(streakData?.longest_streak || 0);

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user]); // If the user changes we fetch the new data

  const dashboardCards = [
    {
      title: "Study Sessions",
      description: "Track and manage your study sessions. View your progress and maintain consistency.",
      href: "/sessions",
      icon: "⏱️",
    },
    {
      title: "Schedules",
      description: "Plan your week by allocating studytime for your topics",
      href: "/schedules",
      icon: "📅",
    },
    {
      title: "Topics",
      description: "Track your knowledge mastery across different subjects. Rate your understanding and monitor your learning progress.",
      href: "/topics",
      icon: "🧠",
    },
    {
      title: "Goals",
      description: "Set and track your learning goals. Stay motivated and achieve your targets.",
      href: "/goals",
      icon: "🎯",
    },
    {
      title: "Analytics",
      description: "View detailed insights about your study patterns and progress over time.",
      href: "/analytics",
      icon: "🔍",
    },
  ];

  return (
    <main className="min-h-screen flex justify-center flex-col p-10 xl:p-40">

      {/* Overview section */}
      <div className="mb-12">

        {/* Welcome section */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold text-white">
            Welcome back <UnderlineLink href="/settings" className="text-pink inline">{username}</UnderlineLink>
          </h1>

          {/* Streak display */}
          <StreakDisplay currentStreak={currentStreak} longestStreak={longestStreak} />
        </div>

        {/* Total study time with current session */}
        <TotalStudyTime 
          totalSeconds={totalStudyTime + (isRunning ? currentSessionTotalTime : 0)}
          currentSessionTime={time}
          isRunning={isRunning}
          formatTime={formatTime}
          isBreak={isBreak}
        />
        <p className="text-xl text-pink-2">
          Your personal study companion. Track, analyze, and achieve your learning goals.
        </p>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card, index) => (
          <DashboardCard key={index} {...card} />
        ))}
      </div>
    </main>
  );
}