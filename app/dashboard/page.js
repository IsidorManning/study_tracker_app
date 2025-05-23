"use client"
import React, { useState, useEffect } from 'react';
import {
  IconTimeDuration45,
  IconFocus2,
  IconZoom,
  IconFlame,
} from "@tabler/icons-react"
import Link from 'next/link';
import UnderlineLink from '@/components/animations/UnderlineLink';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useTimer } from '@/lib/TimerContext';

const DashboardCard = ({ title, description, href, icon }) => (
  <Link href={href} className="group block">
    <div className="h-full p-6 rounded-lg border border-acc-1 bg-black-2 hover:bg-black-3 transition-all duration-300 transform hover:scale-[1.02]">
      <div className="flex flex-col h-full">
        <div className="mb-4 text-pink-3 text-[50px] group-hover:text-ctext-1 transition-colors duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-ctext-1">{title}</h3>
        <p className="text-pink-2 group-hover:text-pink-3 transition-colors duration-300">{description}</p>
      </div>
    </div>
  </Link>
);

const TotalStudyTime = ({ totalSeconds, currentSessionTime, isRunning, formatTime, isBreak }) => {
  const formatTimeReadable = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours} hour${hours === 1 ? '' : 's'}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes === 1 ? '' : 's'}`);
    if (secs > 0) parts.push(`${secs} second${secs === 1 ? '' : 's'}`);

    if (parts.length === 0) return "0 seconds";

    if (parts.length === 1) return parts[0];
    if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
    return `${parts[0]}, ${parts[1]}, and ${parts[2]}`;
  };

  return (
    <div className="bg-black rounded-lg p-6 border border-acc-1 mb-8">
      <div className="flex justify-between items-center">
        <p className="text-2xl text-white">
          <span className="text-pink font-semibold">{formatTimeReadable(totalSeconds)}</span> of being curious
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
  const username = user?.user_metadata?.username || user?.user_metadata?.full_name || 'there';
  const { time, isRunning, totalStudyTime: currentSessionTotalTime, formatTime, isBreak } = useTimer();

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
  }, [user]);

  const cards = [
    {
      title: "Study Sessions",
      description: "Track and manage your study sessions. View your progress and maintain consistency.",
      href: "/sessions",
      icon: "⏱️",
    },
    {
      title: "Goals",
      description: "Set and track your learning goals. Stay motivated and achieve your targets.",
      href: "/goals",
      icon: "🎯",
    },
    {
      title: "Topics",
      description: "Track your knowledge mastery across different subjects. Rate your understanding and monitor your learning progress.",
      href: "/topics",
      icon: "🧠",
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
      {/* Welcome Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold text-ctext-1">
            Welcome back <UnderlineLink href="/settings" className="text-pink inline">{username}</UnderlineLink>
          </h1>
          <StreakDisplay currentStreak={currentStreak} longestStreak={longestStreak} />
        </div>
        {/* Total Study Time with Current Session */}
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
        {cards.map((card, index) => (
          <DashboardCard key={index} {...card} />
        ))}
      </div>
    </main>
  );
}