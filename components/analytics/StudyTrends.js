import React from 'react';
import { IconChevronLeft, IconChevronRight, IconTrendingUp } from '@tabler/icons-react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import InsightCard from './InsightCard';

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
            <Bar dataKey="total_hours" fill="#CEABB1" />
            <Line 
              type="monotone" 
              dataKey="trend" 
              stroke="#6366f1" 
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </InsightCard>
  );
};

export default StudyTrends; 