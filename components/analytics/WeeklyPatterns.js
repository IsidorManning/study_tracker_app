import React from 'react';
import { IconCalendar } from '@tabler/icons-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import InsightCard from './InsightCard';

const WeeklyPatterns = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-blackg-2 p-3 border border-text-white rounded-lg">
          <p className="text-white">Day: {label}</p>
          <p className="text-white">Hours: {payload[0].value.toFixed(1)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <InsightCard
      title="Weekly Patterns"
      description="Discover your study habits across different days of the week"
      icon={IconCalendar}
      dataExplanation={
        <div className="space-y-4">
          <div>
            <h4 className="text-white font-semibold mb-2">Data Structure</h4>
            <pre className="bg-black p-3 rounded-lg text-sm">
{`{
  day: string,    // Day of the week
  hours: number   // Average study hours for that day
}`}
            </pre>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Visualization Details</h4>
            <ul className="list-disc pl-4 space-y-2">
              <li>Shows average study hours for each day of the week</li>
              <li>Helps identify your most productive days</li>
              <li>Useful for planning your study schedule</li>
            </ul>
          </div>
        </div>
      }
    >
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis dataKey="day" stroke="#666" />
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
            <Bar dataKey="hours" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </InsightCard>
  );
};

export default WeeklyPatterns; 