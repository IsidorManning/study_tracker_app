import React from 'react';
import { IconFlame, IconTrophy, IconChartBar } from '@tabler/icons-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import InsightCard from './InsightCard';

const StreakAnalytics = ({ streakData }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-blackg-2 p-3 border border-text-white rounded-lg">
          <p className="text-white">Date: {label}</p>
          <p className="text-white">Current Streak: {payload[0].value} days</p>
          <p className="text-pink-3">Longest Streak: {payload[1].value} days</p>
        </div>
      );
    }
    return null;
  };

  return (
    <InsightCard
      title="Study Streaks"
      description="Track your study consistency and achievements"
      icon={IconFlame}
      dataExplanation={
        <div className="space-y-4">
          <div>
            <h4 className="text-white font-semibold mb-2">Data Structure</h4>
            <pre className="bg-black p-3 rounded-lg text-sm">
{`{
  currentStreak: number,
  longestStreak: number,
  totalStreakDays: number,
  streakHistory: [
    {
      date: string,
      currentStreak: number,
      longestStreak: number
    }
  ]
}`}
            </pre>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Visualization Details</h4>
            <ul className="list-disc pl-4 space-y-2">
              <li>Shows your current and longest study streaks</li>
              <li>Helps track your consistency over time</li>
              <li>Motivates you to maintain your streak</li>
            </ul>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-black/50 p-4 rounded-lg border border-text-white">
          <div className="flex items-center gap-2 mb-2">
            <IconFlame className="text-pink-3" size={20} />
            <h4 className="text-white font-medium">Current Streak</h4>
          </div>
          <p className="text-2xl font-bold text-white">{streakData.currentStreak} days</p>
        </div>
        <div className="bg-black/50 p-4 rounded-lg border border-text-white">
          <div className="flex items-center gap-2 mb-2">
            <IconTrophy className="text-yellow-400" size={20} />
            <h4 className="text-white font-medium">Longest Streak</h4>
          </div>
          <p className="text-2xl font-bold text-white">{streakData.longestStreak} days</p>
        </div>
        <div className="bg-black/50 p-4 rounded-lg border border-text-white">
          <div className="flex items-center gap-2 mb-2">
            <IconChartBar className="text-blue-400" size={20} />
            <h4 className="text-white font-medium">Total Study Days</h4>
          </div>
          <p className="text-2xl font-bold text-white">{streakData.totalStreakDays} days</p>
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={streakData.streakHistory} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis 
              dataKey="date" 
              stroke="#666"
              tickFormatter={(date) => new Date(date).getDate()}
            />
            <YAxis 
              stroke="#666"
              label={{ 
                value: 'Days', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#666' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="currentStreak" 
              stroke="#CEABB1" 
              strokeWidth={2}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="longestStreak" 
              stroke="#6366f1" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </InsightCard>
  );
};

export default StreakAnalytics; 