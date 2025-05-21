"use client"
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Legend
} from 'recharts';
import { 
  IconChevronLeft, 
  IconChevronRight, 
  IconTrendingUp, 
  IconClock, 
  IconTarget,
  IconCalendar,
  IconBrain,
  IconInfoCircle,
  IconChevronDown,
  IconFlame,
  IconTrophy,
  IconChartBar
} from '@tabler/icons-react';
import { Tooltip as MuiTooltip, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';

const COLORS = ['#CEABB1', '#6366f1', '#7DCEA0'];

// Set this to true to use dummy data, false to use real data
const USE_DUMMY_DATA = true;

// Dummy data generators
const generateDummyMonthlyData = (date) => {
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => ({
    date: new Date(date.getFullYear(), date.getMonth(), i + 1).toISOString().split('T')[0],
    total_hours: Math.random() * 6 + 1 // Random hours between 1 and 7
  }));
};

const generateDummyProductivityData = () => ({
  productivity: [
    { name: 'Study Time', value: 72000 }, // 20 hours
    { name: 'Break Time', value: 18000 }  // 5 hours
  ],
  completion: [
    { name: 'Completed', value: 25 },
    { name: 'Incomplete', value: 5 }
  ]
});

const generateDummyWeeklyData = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days.map(day => ({
    day,
    hours: Math.random() * 4 + 2 // Random hours between 2 and 6
  }));
};

const generateDummyFocusData = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    focus: Math.random() * 0.5 + 0.5 // Random focus score between 0.5 and 1.0
  }));
};

const generateDummyStreakData = () => {
  const today = new Date();
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const streakHistory = [];
  let currentStreak = 0;
  let longestStreak = 0;
  let totalStreakDays = 0;

  // Generate 30 days of streak data
  for (let i = 0; i < 30; i++) {
    const date = new Date(lastMonth);
    date.setDate(date.getDate() + i);
    
    // 80% chance of studying each day
    const studied = Math.random() < 0.8;
    
    if (studied) {
      currentStreak++;
      totalStreakDays++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }

    streakHistory.push({
      date: date.toISOString().split('T')[0],
      currentStreak,
      longestStreak,
      totalStreakDays
    });
  }

  return {
    currentStreak,
    longestStreak,
    totalStreakDays,
    streakHistory,
    averageStreakLength: totalStreakDays / (currentStreak === 0 ? 1 : currentStreak)
  };
};

const InsightCard = ({ title, description, icon: Icon, children, dataExplanation }) => (
  <div className="!bg-black g-2 p-6 rounded-lg border border-text-white">
    <div className="flex items-start gap-4 mb-4">
      <div className="p-2 bg-text-white/10 rounded-lg">
        <Icon className="text-white" size={24} />
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-white mt-1">{description}</p>
      </div>
    </div>
    <div className="relative">
      {children}
      {dataExplanation && (
        <div>
          <Accordion className="!bg-transparent !shadow-none !border-0">
            <AccordionSummary
              expandIcon={<IconChevronDown className="text-white transition-transform duration-200" />}
              className="!min-h-0 !p-0 hover:!bg-transparent"
              sx={{
                color: "black",
                '& .MuiAccordionSummary-expandIconWrapper': {
                  transform: 'rotate(0deg)',
                },
                '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                  transform: 'rotate(180deg)',
                },
              }}
            >
              <div className="flex items-center gap-2">
                <IconInfoCircle className="text-white" size={20} />
                <Typography className="text-white">Data Details</Typography>
              </div>
            </AccordionSummary>
            <AccordionDetails className="!p-0 !mt-2">
              <div className="prose prose-invert max-w-none bg-black p-4 rounded-lg border border-text-white">
                {dataExplanation}
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      )}
    </div>
  </div>
);

const StudyTrends = ({ data, currentMonth, onMonthChange }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-blackg-2 p-3 border border-text-white rounded-lg">
          <p className="text-white">Date: {label}</p>
          <p className="text-white">Hours: {payload[0].value.toFixed(1)}</p>
          {payload[1] && (
            <p className="text-pink-3">Trend: {payload[1].value.toFixed(1)}</p>
          )}
        </div>
      );
    }
    return null;
  };

  const formatMonth = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  return (
    <InsightCard
      title="Study Trends"
      description="Track your daily study hours and identify patterns in your learning schedule"
      icon={IconTrendingUp}
      dataExplanation={
        <div className="space-y-4">
          <div>
            <h4 className="text-white font-semibold mb-2">Data Structure</h4>
            <pre className="bg-black p-3 rounded-lg text-sm">
{`{
  date: string,      // ISO date string (YYYY-MM-DD)
  total_hours: number // Study hours for that day
}`}
            </pre>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Visualization Details</h4>
            <ul className="list-disc pl-4 space-y-2">
              <li>Shows daily study hours for the selected month</li>
              <li>Bars represent actual study hours for each day</li>
              <li>Trend line shows the overall study pattern throughout the month</li>
              <li>Hover over any point to see exact hours and trend value</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Data Source</h4>
            <p>Aggregates study sessions from the selected month, converting session durations to daily totals.</p>
          </div>
        </div>
      }
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onMonthChange(-1)}
            className="p-2 hover:bg-black rounded-lg transition-colors"
          >
            <IconChevronLeft className="text-white" />
          </button>
          <span className="text-white font-medium">{formatMonth(currentMonth)}</span>
          <button
            onClick={() => onMonthChange(1)}
            className="p-2 hover:bg-black rounded-lg transition-colors"
          >
            <IconChevronRight className="text-white" />
          </button>
        </div>
      </div>
      <div className="h-[300px] mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis 
              dataKey="date" 
              stroke="#666"
              tickFormatter={(date) => new Date(date).getDate()}
            />
            <YAxis 
              stroke="#666"
              label={{ 
                value: 'Hours', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#666' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="total_hours" 
              fill="#CEABB1" 
              radius={[4, 4, 0, 0]}
            />
            <Line
              type="monotone"
              dataKey="total_hours"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-2">How to Use This Visualization</h4>
        <p className="text-white mb-4">
          This visualization helps you understand your study patterns and consistency. Look for:
        </p>
        <ul className="list-disc pl-4 space-y-2 text-white">
          <li>Consistent study blocks: Are you maintaining regular study hours?</li>
          <li>Trend direction: Is your study time increasing or decreasing?</li>
          <li>Peak days: Which days show the highest study hours?</li>
          <li>Gaps: Are there days with no study time? Consider why and how to address them.</li>
        </ul>
      </div>
    </InsightCard>
  );
};

const ProductivityInsights = ({ data }) => {
  const formatHours = (seconds) => (seconds / 3600).toFixed(1);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-blackg-2 p-3 border border-text-white rounded-lg">
          <p className="text-white">{payload[0].name}</p>
          <p className="text-white">{formatHours(payload[0].value)} hours</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InsightCard
        title="Study vs Break Time"
        description="Balance between focused study time and breaks for optimal learning"
        icon={IconClock}
        dataExplanation={
          <div className="space-y-4">
            <div>
              <h4 className="text-white font-semibold mb-2">Data Structure</h4>
              <pre className="bg-black p-3 rounded-lg text-sm">
{`{
  productivity: [
    { name: string, value: number }, // Study time in seconds
    { name: string, value: number }  // Break time in seconds
  ]
}`}
              </pre>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Visualization Details</h4>
              <ul className="list-disc pl-4 space-y-2">
                <li>Shows the distribution of study time vs break time</li>
                <li>Based on the last 30 study sessions</li>
                <li>Percentages show the proportion of total time spent studying vs taking breaks</li>
                <li>Hover to see exact hours for each category</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Data Source</h4>
              <p>Calculates total study duration and break duration from your recent study sessions.</p>
            </div>
          </div>
        }
      >
        <div className="h-[300px] mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.productivity}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.productivity.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">How to Use This Visualization</h4>
          <p className="text-white mb-4">
            Understanding your study-break balance is crucial for effective learning. Consider:
          </p>
          <ul className="list-disc pl-4 space-y-2 text-white">
            <li>Break ratio: Aim for a 25-30% break time ratio for optimal focus</li>
            <li>Break distribution: Are breaks evenly distributed or clustered?</li>
            <li>Study intensity: Longer study blocks might need more frequent breaks</li>
            <li>Pattern changes: How does your ratio change over different study sessions?</li>
          </ul>
        </div>
      </InsightCard>

      <InsightCard
        title="Session Completion"
        description="Track how often you complete your planned study sessions"
        icon={IconTarget}
        dataExplanation={
          <div className="space-y-4">
            <div>
              <h4 className="text-white font-semibold mb-2">Data Structure</h4>
              <pre className="bg-black p-3 rounded-lg text-sm">
{`{
  completion: [
    { name: string, value: number }, // Completed sessions count
    { name: string, value: number }  // Incomplete sessions count
  ]
}`}
              </pre>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Visualization Details</h4>
              <ul className="list-disc pl-4 space-y-2">
                <li>Shows the ratio of completed to incomplete study sessions</li>
                <li>Based on the last 30 study sessions</li>
                <li>Percentages indicate your session completion rate</li>
                <li>Hover to see the exact number of sessions in each category</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Data Source</h4>
              <p>Tracks whether each study session was completed as planned or interrupted.</p>
            </div>
          </div>
        }
      >
        <div className="h-[300px] mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.completion}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.completion.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">How to Use This Visualization</h4>
          <p className="text-white mb-4">
            Session completion rate is a key indicator of study effectiveness. Look for:
          </p>
          <ul className="list-disc pl-4 space-y-2 text-white">
            <li>Completion rate: Aim for at least 80% completion rate</li>
            <li>Interruption patterns: What causes incomplete sessions?</li>
            <li>Session length: Are longer sessions more likely to be interrupted?</li>
            <li>Time of day: Are certain times more prone to interruptions?</li>
          </ul>
        </div>
      </InsightCard>
    </div>
  );
};

const WeeklyPatterns = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-blackg-2 p-3 border border-text-white rounded-lg">
          <p className="text-white">Day: {label}</p>
          <p className="text-white">Average Hours: {payload[0].value.toFixed(1)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <InsightCard
      title="Weekly Study Patterns"
      description="Discover your most productive days and optimize your schedule"
      icon={IconCalendar}
      dataExplanation={
        <div className="space-y-4">
          <div>
            <h4 className="text-white font-semibold mb-2">Data Structure</h4>
            <pre className="bg-black p-3 rounded-lg text-sm">
{`{
  day: string,      // Day of the week
  hours: number     // Average study hours for that day
}`}
            </pre>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Visualization Details</h4>
            <ul className="list-disc pl-4 space-y-2">
              <li>Shows average study hours for each day of the week</li>
              <li>Based on the last 90 days of study sessions</li>
              <li>Helps identify your most and least productive days</li>
              <li>Hover to see exact average hours for each day</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Data Source</h4>
            <p>Calculates average study hours for each day of the week from your recent study history.</p>
          </div>
        </div>
      }
    >
      <div className="h-[300px] mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis 
              dataKey="day" 
              stroke="#666"
            />
            <YAxis 
              stroke="#666"
              label={{ 
                value: 'Average Hours', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#666' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="hours"
              stroke="#CEABB1"
              fill="#CEABB1"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-2">How to Use This Visualization</h4>
        <p className="text-white mb-4">
          Weekly patterns help optimize your study schedule. Consider:
        </p>
        <ul className="list-disc pl-4 space-y-2 text-white">
          <li>Peak days: Schedule challenging topics on your most productive days</li>
          <li>Recovery days: Use less productive days for review and lighter study</li>
          <li>Weekend patterns: How does your study pattern differ on weekends?</li>
          <li>Consistency: Are there significant variations between weekdays?</li>
        </ul>
      </div>
    </InsightCard>
  );
};

const FocusMetrics = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-blackg-2 p-3 border border-text-white rounded-lg">
          <p className="text-white">Time: {label}</p>
          <p className="text-white">Focus Score: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <InsightCard
      title="Focus Analysis"
      description="Measure your focus levels throughout the day to find your peak productivity hours"
      icon={IconBrain}
      dataExplanation={
        <div className="space-y-4">
          <div>
            <h4 className="text-white font-semibold mb-2">Data Structure</h4>
            <pre className="bg-black p-3 rounded-lg text-sm">
{`{
  time: string,     // Hour of the day (0-23)
  focus: number     // Average focus score (0-1)
}`}
            </pre>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Visualization Details</h4>
            <ul className="list-disc pl-4 space-y-2">
              <li>Shows your average focus level for each hour of the day</li>
              <li>Based on the last 30 study sessions</li>
              <li>Helps identify your peak productivity hours</li>
              <li>Hover to see exact focus scores for each hour</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Data Source</h4>
            <p>Calculates average focus scores for each hour based on your recent study sessions.</p>
          </div>
        </div>
      }
    >
      <div className="h-[300px] mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis 
              dataKey="time" 
              stroke="#666"
            />
            <YAxis 
              stroke="#666"
              label={{ 
                value: 'Focus Score', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#666' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="focus" 
              fill="#7DCEA0" 
              radius={[4, 4, 0, 0]}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-2">How to Use This Visualization</h4>
        <p className="text-white mb-4">
          Understanding your focus patterns can significantly improve study efficiency. Look for:
        </p>
        <ul className="list-disc pl-4 space-y-2 text-white">
          <li>Peak hours: Schedule important study sessions during your highest focus periods</li>
          <li>Focus cycles: Identify natural focus cycles throughout the day</li>
          <li>Low focus periods: Use these times for breaks or lighter study tasks</li>
          <li>Pattern changes: How does your focus level change after breaks?</li>
        </ul>
      </div>
    </InsightCard>
  );
};

const StreakAnalytics = ({ streakData }) => {
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year', 'all'
  const [filteredHistory, setFilteredHistory] = useState([]);

  useEffect(() => {
    if (!streakData?.streakHistory) return;

    const today = new Date();
    let startDate = new Date();

    switch (timeRange) {
      case 'week':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(today.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      case 'all':
        startDate = new Date(0); // Beginning of time
        break;
      default:
        startDate.setMonth(today.getMonth() - 1);
    }

    const filtered = streakData.streakHistory.filter(entry => 
      new Date(entry.date) >= startDate
    );
    setFilteredHistory(filtered);
  }, [streakData, timeRange]);

  if (!streakData) return null;

  return (
    <div className="space-y-8">
      <div className="bg-black-2 rounded-lg p-6 border border-acc-1">
        <h2 className="text-2xl font-bold text-white mb-4">Streak Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black-3 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Current Streak</h3>
            <p className="text-3xl font-bold text-pink-3">{streakData.currentStreak} days</p>
            <p className="text-white/60 mt-2">Keep up the momentum!</p>
          </div>
          <div className="bg-black-3 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Longest Streak</h3>
            <p className="text-3xl font-bold text-pink-3">{streakData.longestStreak} days</p>
            <p className="text-white/60 mt-2">Your best performance</p>
          </div>
          <div className="bg-black-3 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Average Streak</h3>
            <p className="text-3xl font-bold text-pink-3">{streakData.averageStreakLength.toFixed(1)} days</p>
            <p className="text-white/60 mt-2">Your typical streak length</p>
          </div>
        </div>
      </div>

      <div className="bg-black-2 rounded-lg p-6 border border-acc-1">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Streak History</h3>
          <div className="flex gap-2">
            {['week', 'month', 'year', 'all'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors
                  ${timeRange === range 
                    ? 'bg-pink-3 text-white' 
                    : 'bg-black-3 text-white/60 hover:bg-black-4 hover:text-white'
                  }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis 
                dataKey="date" 
                stroke="#888"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  switch (timeRange) {
                    case 'week':
                      return date.toLocaleDateString('en-US', { weekday: 'short' });
                    case 'month':
                      return date.getDate();
                    case 'year':
                      return date.toLocaleDateString('en-US', { month: 'short' });
                    default:
                      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                  }
                }}
              />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '4px'
                }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#fff' }}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="currentStreak" 
                stroke="#ff6b6b" 
                name="Current Streak"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="longestStreak" 
                stroke="#4ecdc4" 
                name="Longest Streak"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4">
          <Accordion className="!bg-transparent !shadow-none !border-0">
            <AccordionSummary
              expandIcon={<IconChevronDown className="text-white transition-transform duration-200" />}
              className="!min-h-0 !p-0 hover:!bg-transparent"
              sx={{
                color: "black",
                '& .MuiAccordionSummary-expandIconWrapper': {
                  transform: 'rotate(0deg)',
                },
                '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                  transform: 'rotate(180deg)',
                },
              }}
            >
              <div className="flex items-center gap-2">
                <IconInfoCircle className="text-white" size={20} />
                <Typography className="text-white">Data Details</Typography>
              </div>
            </AccordionSummary>
            <AccordionDetails className="!p-0 !mt-2">
              <div className="prose prose-invert max-w-none bg-black p-4 rounded-lg border border-text-white">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Data Structure</h4>
                    <pre className="bg-black p-3 rounded-lg text-sm">
{`{
  date: string,           // ISO date string (YYYY-MM-DD)
  currentStreak: number,  // Current streak length
  longestStreak: number,  // Longest streak achieved
  totalStreakDays: number // Total days with streaks
}`}
                    </pre>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Visualization Details</h4>
                    <ul className="list-disc pl-4 space-y-2">
                      <li>Shows your streak progression over the selected time period</li>
                      <li>Red line represents your current streak</li>
                      <li>Teal line shows your longest streak achieved</li>
                      <li>Hover over any point to see exact values</li>
                      <li>Use the time range buttons to view different periods</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Data Source</h4>
                    <p>Tracks your daily study consistency and streak achievements.</p>
                  </div>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
        <div className="mt-4">
          <h4 className="text-white font-semibold mb-2">How to Use This Visualization</h4>
          <p className="text-white mb-4">
            Understanding your streak patterns can help improve study consistency. Look for:
          </p>
          <ul className="list-disc pl-4 space-y-2 text-white">
            <li>Streak growth: How quickly does your streak increase?</li>
            <li>Break patterns: When do you typically break your streaks?</li>
            <li>Recovery: How quickly do you recover after breaking a streak?</li>
            <li>Consistency: Compare your current streak to your average streak length</li>
            <li>Milestones: Track progress towards beating your longest streak</li>
            <li>Time patterns: Use different time ranges to identify long-term trends</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthlyData, setMonthlyData] = useState([]);
  const [productivityData, setProductivityData] = useState({
    productivity: [],
    completion: []
  });
  const [weeklyData, setWeeklyData] = useState([]);
  const [focusData, setFocusData] = useState([]);
  const [streakData, setStreakData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMonthlyData(currentMonth);
      fetchProductivityData();
      fetchWeeklyData();
      fetchFocusData();
      fetchStreakData();
    }
  }, [user, currentMonth]);

  const fetchMonthlyData = async (date) => {
    try {
      const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('start_time', startDate.toISOString())
        .lte('start_time', endDate.toISOString());

      if (error) throw error;

      // Process data for the chart
      const processedData = processMonthlyData(data, startDate, endDate);
      setMonthlyData(processedData);
    } catch (error) {
      console.error('Error fetching monthly data:', error);
    }
  };

  const fetchProductivityData = async () => {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: false })
        .limit(30);

      if (error) throw error;

      // Process data for productivity insights
      const processedData = processProductivityData(data);
      setProductivityData(processedData);
    } catch (error) {
      console.error('Error fetching productivity data:', error);
    }
  };

  const fetchWeeklyData = async () => {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: false })
        .limit(90);

      if (error) throw error;

      // Process data for weekly patterns
      const processedData = processWeeklyData(data);
      setWeeklyData(processedData);
    } catch (error) {
      console.error('Error fetching weekly data:', error);
    }
  };

  const fetchFocusData = async () => {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: false })
        .limit(30);

      if (error) throw error;

      // Process data for focus analysis
      const processedData = processFocusData(data);
      setFocusData(processedData);
    } catch (error) {
      console.error('Error fetching focus data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStreakData = async () => {
    if (USE_DUMMY_DATA) {
      setStreakData(generateDummyStreakData());
    } else {
      try {
        const { data: streakData, error } = await supabase
          .from('user_streaks')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setStreakData(streakData);
      } catch (error) {
        console.error('Error fetching streak data:', error);
        setStreakData(null);
      }
    }
  };

  const handleMonthChange = (delta) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + delta);
    setCurrentMonth(newMonth);
  };

  if (loading) {
    return (
      <div className="p-8 pt-24">
        <div className="text-white">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="p-8 pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">Analytics</h1>
          <p className="text-white mt-2">
            Gain insights into your study patterns and optimize your learning journey
          </p>
        </div>

        <div className="space-y-6">
          <StudyTrends 
            data={monthlyData} 
            currentMonth={currentMonth} 
            onMonthChange={handleMonthChange} 
          />
          
          <ProductivityInsights data={productivityData} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WeeklyPatterns data={weeklyData} />
            <FocusMetrics data={focusData} />
          </div>
          
          {streakData && <StreakAnalytics streakData={streakData} />}
        </div>
      </div>
    </div>
  );
}

// Helper functions for data processing
const processMonthlyData = (data, startDate, endDate) => {
  if (USE_DUMMY_DATA) {
    return generateDummyMonthlyData(startDate);
  }
  
  return data.map(session => ({
    date: new Date(session.start_time).toISOString().split('T')[0],
    total_hours: session.duration / 3600
  }));
};

const processProductivityData = (data) => {
  if (USE_DUMMY_DATA) {
    return generateDummyProductivityData();
  }

  return {
    productivity: [
      { name: 'Study Time', value: data.reduce((acc, session) => acc + session.duration, 0) },
      { name: 'Break Time', value: data.reduce((acc, session) => acc + (session.break_duration || 0), 0) }
    ],
    completion: [
      { name: 'Completed', value: data.filter(session => session.completed).length },
      { name: 'Incomplete', value: data.filter(session => !session.completed).length }
    ]
  };
};

const processWeeklyData = (data) => {
  if (USE_DUMMY_DATA) {
    return generateDummyWeeklyData();
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days.map(day => ({
    day,
    hours: data
      .filter(session => new Date(session.start_time).getDay() === days.indexOf(day))
      .reduce((acc, session) => acc + session.duration / 3600, 0) / 4 // Average over 4 weeks
  }));
};

const processFocusData = (data) => {
  if (USE_DUMMY_DATA) {
    return generateDummyFocusData();
  }

  const hours = Array.from({ length: 24 }, (_, i) => i);
  return hours.map(hour => ({
    time: `${hour}:00`,
    focus: data
      .filter(session => new Date(session.start_time).getHours() === hour)
      .reduce((acc, session) => acc + (session.focus_score || 0), 0) / 
      Math.max(1, data.filter(session => new Date(session.start_time).getHours() === hour).length)
  }));
};

const processStreakData = async (userId) => {
  if (USE_DUMMY_DATA) {
    return generateDummyStreakData();
  }

  try {
    const { data: streakData, error } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return streakData;
  } catch (error) {
    console.error('Error fetching streak data:', error);
    return null;
  }
};

