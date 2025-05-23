import React from 'react';
import { IconBrain } from '@tabler/icons-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import InsightCard from './InsightCard';

const FocusMetrics = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-blackg-2 p-3 border border-text-white rounded-lg">
          <p className="text-white">Time: {label}</p>
          <p className="text-white">Focus: {(payload[0].value * 100).toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <InsightCard
      title="Focus Metrics"
      description="Track your focus levels throughout the day to optimize your study schedule"
      icon={IconBrain}
      dataExplanation={
        <div className="space-y-4">
          <div>
            <h4 className="text-white font-semibold mb-2">Data Structure</h4>
            <pre className="bg-black p-3 rounded-lg text-sm">
{`{
  time: string,   // Hour of the day (0-23)
  focus: number   // Focus level (0-1)
}`}
            </pre>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Visualization Details</h4>
            <ul className="list-disc pl-4 space-y-2">
              <li>Shows your focus levels throughout the day</li>
              <li>Helps identify your most focused hours</li>
              <li>Useful for scheduling important study sessions</li>
            </ul>
          </div>
        </div>
      }
    >
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis 
              dataKey="time" 
              stroke="#666"
              label={{ 
                value: 'Hour of Day', 
                position: 'bottom',
                style: { textAnchor: 'middle', fill: '#666' }
              }}
            />
            <YAxis 
              stroke="#666"
              label={{ 
                value: 'Focus Level', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#666' }
              }}
              domain={[0, 1]}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="focus" 
              stroke="#7DCEA0" 
              fill="#7DCEA0" 
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </InsightCard>
  );
};

export default FocusMetrics; 