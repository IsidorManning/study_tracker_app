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
import StudyTrends from '@/components/analytics/StudyTrends';
import ProductivityInsights from '@/components/analytics/ProductivityInsights';
import WeeklyPatterns from '@/components/analytics/WeeklyPatterns';
import FocusMetrics from '@/components/analytics/FocusMetrics';
import StreakAnalytics from '@/components/analytics/StreakAnalytics';

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

const TopicKnowledge = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-blackg-2 p-3 border border-text-white rounded-lg">
          <p className="text-white">Topic: {label}</p>
          <p className="text-white">Rating: {payload[0].value}/5</p>
        </div>
      );
    }
    return null;
  };

  return (
    <InsightCard
      title="Topic Knowledge Progress"
      description="Track your knowledge level across different topics"
      icon={IconBrain}
      dataExplanation={
        <div className="space-y-4">
          <div>
            <h4 className="text-white font-semibold mb-2">Data Structure</h4>
            <pre className="bg-black p-3 rounded-lg text-sm">
{`{
  name: string,     // Topic name
  rating: number    // Knowledge rating (1-5)
}`}
            </pre>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Visualization Details</h4>
            <ul className="list-disc pl-4 space-y-2">
              <li>Shows your current knowledge level for each topic</li>
              <li>Ratings range from 1 (beginner) to 5 (expert)</li>
              <li>Helps identify areas that need more focus</li>
              <li>Hover to see exact ratings for each topic</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Data Source</h4>
            <p>Based on your self-assessed knowledge ratings for each topic.</p>
          </div>
        </div>
      }
    >
      <div className="h-[300px] mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis 
              dataKey="name" 
              stroke="#666"
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis 
              stroke="#666"
              domain={[0, 5]}
              ticks={[1, 2, 3, 4, 5]}
              label={{ 
                value: 'Knowledge Level', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#666' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="rating" 
              fill="#FCD34D" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-2">How to Use This Visualization</h4>
        <p className="text-white mb-4">
          Understanding your topic knowledge levels helps optimize your study strategy. Consider:
        </p>
        <ul className="list-disc pl-4 space-y-2 text-white">
          <li>Weak areas: Focus on topics with lower ratings</li>
          <li>Strong areas: Use these as foundations for related topics</li>
          <li>Progress tracking: Update ratings as your knowledge grows</li>
          <li>Study planning: Allocate more time to lower-rated topics</li>
        </ul>
      </div>
    </InsightCard>
  );
};

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthlyData, setMonthlyData] = useState([]);
  const [productivityData, setProductivityData] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [focusData, setFocusData] = useState([]);
  const [streakData, setStreakData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [topicData, setTopicData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (USE_DUMMY_DATA) {
          setMonthlyData(generateDummyMonthlyData(currentMonth));
          setProductivityData(generateDummyProductivityData());
          setWeeklyData(generateDummyWeeklyData());
          setFocusData(generateDummyFocusData());
          setStreakData(generateDummyStreakData());
        } else {
          await fetchMonthlyData(currentMonth);
          await fetchProductivityData();
          await fetchWeeklyData();
          await fetchFocusData();
          await fetchStreakData();
          await fetchTopicData();
        }
      } catch (error) {
        console.error('Error loading analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentMonth]);

  const fetchMonthlyData = async (date) => {
    if (!user) return;
    
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    const { data, error } = await supabase
      .from('study_sessions')
      .select('*')
      .gte('start_time', startDate.toISOString())
      .lte('start_time', endDate.toISOString())
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching monthly data:', error);
      return;
    }

    const processedData = processMonthlyData(data, startDate, endDate);
    setMonthlyData(processedData);
  };

  const fetchProductivityData = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching productivity data:', error);
      return;
    }

    const processedData = processProductivityData(data);
    setProductivityData(processedData);
  };

  const fetchWeeklyData = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching weekly data:', error);
      return;
    }

    const processedData = processWeeklyData(data);
    setWeeklyData(processedData);
  };

  const fetchFocusData = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching focus data:', error);
      return;
    }

    const processedData = processFocusData(data);
    setFocusData(processedData);
  };

  const fetchStreakData = async () => {
    if (!user) return;
    
    const processedData = await processStreakData(user.id);
    setStreakData(processedData);
  };

  const fetchTopicData = async () => {
    try {
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .eq('user_id', user.id)

      if (error) throw error;
      setTopicData(data || []);
    } catch (error) {
      console.error('Error fetching topic data:', error);
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
          <TopicKnowledge data={topicData} />
        </div>
      </div>
    </div>
  );
}

// Data processing functions
const processMonthlyData = (data, startDate, endDate) => {
  const dailyData = {};
  
  // Initialize all days in the month
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    dailyData[dateStr] = { date: dateStr, total_hours: 0 };
  }

  // Aggregate study hours for each day
  data.forEach(session => {
    const date = new Date(session.start_time).toISOString().split('T')[0];
    if (dailyData[date]) {
      dailyData[date].total_hours += session.duration / 3600; // Convert seconds to hours
    }
  });

  // Convert to array and calculate trend
  const result = Object.values(dailyData);
  const trend = calculateTrend(result.map(d => d.total_hours));
  result.forEach((day, i) => {
    day.trend = trend[i];
  });

  return result;
};

const processProductivityData = (data) => {
  const totalStudyTime = data.reduce((acc, session) => acc + session.duration, 0);
  const totalBreakTime = data.reduce((acc, session) => acc + (session.break_duration || 0), 0);
  const completedTasks = data.filter(session => session.completed).length;
  const incompleteTasks = data.length - completedTasks;

  return {
    productivity: [
      { name: 'Study Time', value: totalStudyTime },
      { name: 'Break Time', value: totalBreakTime }
    ],
    completion: [
      { name: 'Completed', value: completedTasks },
      { name: 'Incomplete', value: incompleteTasks }
    ]
  };
};

const processWeeklyData = (data) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const weeklyHours = days.map(day => ({ day, hours: 0 }));

  data.forEach(session => {
    const day = new Date(session.start_time).getDay();
    weeklyHours[day].hours += session.duration / 3600;
  });

  return weeklyHours;
};

const processFocusData = (data) => {
  const hourlyFocus = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    focus: 0,
    count: 0
  }));

  data.forEach(session => {
    const hour = new Date(session.start_time).getHours();
    hourlyFocus[hour].focus += session.focus_score || 0.5;
    hourlyFocus[hour].count++;
  });

  return hourlyFocus.map(hour => ({
    time: hour.time,
    focus: hour.count > 0 ? hour.focus / hour.count : 0.5
  }));
};

const processStreakData = async (userId) => {
  const { data, error } = await supabase
    .from('study_sessions')
    .select('start_time')
    .eq('user_id', userId)
    .order('start_time', { ascending: true });

  if (error) {
    console.error('Error fetching streak data:', error);
    return null;
  }

  const dates = new Set(data.map(session => 
    new Date(session.start_time).toISOString().split('T')[0]
  ));

  const today = new Date();
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const streakHistory = [];
  let currentStreak = 0;
  let longestStreak = 0;
  let totalStreakDays = 0;

  for (let d = new Date(lastMonth); d <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const studied = dates.has(dateStr);
    
    if (studied) {
      currentStreak++;
      totalStreakDays++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }

    streakHistory.push({
      date: dateStr,
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

const calculateTrend = (values) => {
  const n = values.length;
  if (n < 2) return values;

  const xMean = (n - 1) / 2;
  const yMean = values.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    const xDiff = i - xMean;
    const yDiff = values[i] - yMean;
    numerator += xDiff * yDiff;
    denominator += xDiff * xDiff;
  }

  const slope = numerator / denominator;
  const intercept = yMean - slope * xMean;

  return values.map((_, i) => slope * i + intercept);
};

