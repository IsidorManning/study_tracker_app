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
  Cell
} from 'recharts';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

// Sample data for two months
const sampleData = {
  '2025-05': [
    { date: '2024-03-01', total_hours: 2.5 },
    { date: '2024-03-02', total_hours: 1.8 },
    { date: '2024-03-03', total_hours: 3.2 },
    { date: '2024-03-04', total_hours: 0 },
    { date: '2024-03-05', total_hours: 4.1 },
    { date: '2024-03-06', total_hours: 2.3 },
    { date: '2024-03-07', total_hours: 1.5 },
    { date: '2024-03-08', total_hours: 3.7 },
    { date: '2024-03-09', total_hours: 2.9 },
    { date: '2024-03-10', total_hours: 0 },
    { date: '2024-03-11', total_hours: 1.2 },
    { date: '2024-03-12', total_hours: 3.4 },
    { date: '2024-03-13', total_hours: 2.1 },
    { date: '2024-03-14', total_hours: 4.5 },
    { date: '2024-03-15', total_hours: 1.9 },
    { date: '2024-03-16', total_hours: 0 },
    { date: '2024-03-17', total_hours: 2.7 },
    { date: '2024-03-18', total_hours: 3.1 },
    { date: '2024-03-19', total_hours: 1.4 },
    { date: '2024-03-20', total_hours: 2.8 },
    { date: '2024-03-21', total_hours: 0 },
    { date: '2024-03-22', total_hours: 3.6 },
    { date: '2024-03-23', total_hours: 2.2 },
    { date: '2024-03-24', total_hours: 1.7 },
    { date: '2024-03-25', total_hours: 3.9 },
    { date: '2024-03-26', total_hours: 2.4 },
    { date: '2024-03-27', total_hours: 1.6 },
    { date: '2024-03-28', total_hours: 3.3 },
    { date: '2024-03-29', total_hours: 2.0 },
    { date: '2024-03-30', total_hours: 1.8 },
    { date: '2024-03-31', total_hours: 0 },
  ],
  '2025-06': [
    { date: '2024-02-01', total_hours: 1.5 },
    { date: '2024-02-02', total_hours: 2.8 },
    { date: '2024-02-03', total_hours: 0 },
    { date: '2024-02-04', total_hours: 3.2 },
    { date: '2024-02-05', total_hours: 2.1 },
    { date: '2024-02-06', total_hours: 1.9 },
    { date: '2024-02-07', total_hours: 3.5 },
    { date: '2024-02-08', total_hours: 2.4 },
    { date: '2024-02-09', total_hours: 0 },
    { date: '2024-02-10', total_hours: 1.7 },
    { date: '2024-02-11', total_hours: 2.9 },
    { date: '2024-02-12', total_hours: 3.1 },
    { date: '2024-02-13', total_hours: 2.2 },
    { date: '2024-02-14', total_hours: 4.0 },
    { date: '2024-02-15', total_hours: 1.8 },
    { date: '2024-02-16', total_hours: 0 },
    { date: '2024-02-17', total_hours: 2.6 },
    { date: '2024-02-18', total_hours: 3.3 },
    { date: '2024-02-19', total_hours: 1.5 },
    { date: '2024-02-20', total_hours: 2.7 },
    { date: '2024-02-21', total_hours: 0 },
    { date: '2024-02-22', total_hours: 3.4 },
    { date: '2024-02-23', total_hours: 2.0 },
    { date: '2024-02-24', total_hours: 1.6 },
    { date: '2024-02-25', total_hours: 3.8 },
    { date: '2024-02-26', total_hours: 2.3 },
    { date: '2024-02-27', total_hours: 1.9 },
    { date: '2024-02-28', total_hours: 3.0 },
    { date: '2024-02-29', total_hours: 2.5 },
  ]
};

const COLORS = ['#CEABB1', '#6366f1'];

const ProductivityPieCharts = ({ data }) => {
  const formatHours = (seconds) => (seconds / 3600).toFixed(1);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-mbg-2 p-3 border border-acc-1 rounded-lg">
          <p className="text-ctext-1">{payload[0].name}</p>
          <p className="text-main">{formatHours(payload[0].value)} hours</p>
        </div>
      );
    }
    return null;
  };

  const CompletionTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-mbg-2 p-3 border border-acc-1 rounded-lg">
          <p className="text-ctext-1">{payload[0].name}</p>
          <p className="text-main">{payload[0].value} sessions</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex gap-8 mt-8">
      {/* Productivity Pie Chart */}
      <div className="flex-1 bg-mbg-2 p-6 rounded-lg border border-acc-1">
        <h3 className="text-xl font-semibold text-ctext-1 mb-4">Study vs Pause Time</h3>
        <div className="h-[300px]">
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
      </div>

      {/* Completion Rate Pie Chart */}
      <div className="flex-1 bg-mbg-2 p-6 rounded-lg border border-acc-1">
        <h3 className="text-xl font-semibold text-ctext-1 mb-4">Session Completion Rate</h3>
        <div className="h-[300px]">
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
              <Tooltip content={<CompletionTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const MonthlyHistogram = ({ data, currentMonth, onMonthChange }) => {
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-mbg-2 p-3 border border-acc-1 rounded-lg">
          <p className="text-ctext-1">Date: {label}</p>
          <p className="text-main">Hours: {payload[0].value.toFixed(1)}</p>
          {payload[1] && (
            <p className="text-acc-3">Trend: {payload[1].value.toFixed(1)}</p>
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
    <div className="w-full h-[400px] bg-mbg-2 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-ctext-1">Study Hours</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onMonthChange(-1)}
            className="p-2 hover:bg-mbg-3 rounded-lg transition-colors"
          >
            <IconChevronLeft className="text-ctext-1" />
          </button>
          <span className="text-ctext-1 font-medium">{formatMonth(currentMonth)}</span>
          <button
            onClick={() => onMonthChange(1)}
            className="p-2 hover:bg-mbg-3 rounded-lg transition-colors"
          >
            <IconChevronRight className="text-ctext-1" />
          </button>
        </div>
      </div>
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
            animationDuration={2000}
            animationBegin={0}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [monthlyData, setMonthlyData] = useState([]);
  const [productivityData, setProductivityData] = useState({
    productivity: [
      { name: 'Study Time', value: 0 },
      { name: 'Pause Time', value: 0 }
    ],
    completion: [
      { name: 'Completed', value: 0 },
      { name: 'Interrupted', value: 0 }
    ]
  });
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const fetchProductivityData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .select('total_seconds, paused_seconds, interrupted')
        .eq('user_id', user.id);

      if (error) throw error;

      // Calculate totals
      const totals = data.reduce((acc, session) => {
        acc.totalStudy += session.total_seconds;
        acc.totalPause += session.paused_seconds || 0;
        acc.completed += session.interrupted ? 0 : 1;
        acc.interrupted += session.interrupted ? 1 : 0;
        return acc;
      }, { totalStudy: 0, totalPause: 0, completed: 0, interrupted: 0 });

      setProductivityData({
        productivity: [
          { name: 'Study Time', value: totals.totalStudy },
          { name: 'Pause Time', value: totals.totalPause }
        ],
        completion: [
          { name: 'Completed', value: totals.completed },
          { name: 'Interrupted', value: totals.interrupted }
        ]
      });
    } catch (error) {
      console.error('Error fetching productivity data:', error);
      // Sample data for testing
      setProductivityData({
        productivity: [
          { name: 'Study Time', value: 72000 }, // 20 hours
          { name: 'Pause Time', value: 18000 }  // 5 hours
        ],
        completion: [
          { name: 'Completed', value: 15 },
          { name: 'Interrupted', value: 5 }
        ]
      });
    }
  };

  useEffect(() => {
    fetchProductivityData();
  }, [user]);

  const fetchMonthlyData = async (date) => {
    if (!user) return;

    try {
      // Get the first and last day of the selected month
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const { data, error } = await supabase
        .from('study_sessions')
        .select('start_time, total_seconds')
        .eq('user_id', user.id)
        .gte('start_time', firstDay.toISOString())
        .lte('start_time', lastDay.toISOString());

      if (error) throw error;

      // Process the data to get daily totals
      const dailyTotals = {};
      
      // Initialize all days of the month with 0
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(firstDay.getFullYear(), firstDay.getMonth(), i);
        dailyTotals[date.toISOString().split('T')[0]] = 0;
      }

      // Sum up the seconds for each day
      data.forEach(session => {
        const date = session.start_time.split('T')[0];
        dailyTotals[date] = (dailyTotals[date] || 0) + session.total_seconds;
      });

      // Convert to the format needed for the chart
      const chartData = Object.entries(dailyTotals).map(([date, seconds]) => ({
        date,
        total_hours: seconds / 3600 // Convert seconds to hours
      }));
      
      // For testing, use sample data
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      setMonthlyData(sampleData[monthKey]);
      // setMonthlyData(chartData);
    } catch (error) {
      console.error('Error fetching monthly data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyData(currentMonth);
  }, [user, currentMonth]);

  const handleMonthChange = (delta) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + delta);
    setCurrentMonth(newMonth);
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="text-ctext-1">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-ctext-1 mb-8">Analytics</h1>
        <MonthlyHistogram 
          data={monthlyData} 
          currentMonth={currentMonth}
          onMonthChange={handleMonthChange}
        />
        <ProductivityPieCharts data={productivityData} />
      </div>
    </div>
  );
}

