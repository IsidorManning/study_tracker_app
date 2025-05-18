"use client"
import React from 'react';
import {
  IconTimeDuration45,
  IconFocus2,
  IconZoom,
} from "@tabler/icons-react"
import Link from 'next/link';
import UnderlineLink from '@/components/animations/UnderlineLink';
import { useAuth } from '@/lib/AuthContext';

const DashboardCard = ({ title, description, href, icon }) => (
  <Link href={href} className="group block">
    <div className="h-full p-6 rounded-lg border border-acc-1 bg-mbg-2 hover:bg-mbg-3 transition-all duration-300 transform hover:scale-[1.02]">
      <div className="flex flex-col h-full">
        <div className="mb-4 text-acc-3 text-[50px] group-hover:text-ctext-1 transition-colors duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-ctext-1">{title}</h3>
        <p className="text-acc-2 group-hover:text-acc-3 transition-colors duration-300">{description}</p>
      </div>
    </div>
  </Link>
);

export default function Dashboard() {
  const { user } = useAuth();
  const username = user?.user_metadata?.username || user?.user_metadata?.full_name || 'there';

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
        <h1 className="text-4xl font-bold text-ctext-1 mb-4">
          Welcome back <UnderlineLink href="/settings" className="text-main inline">{username}</UnderlineLink>
        </h1>
        <p className="text-xl text-acc-2">
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