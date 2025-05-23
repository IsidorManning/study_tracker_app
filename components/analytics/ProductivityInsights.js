import React from 'react';
import { IconClock } from '@tabler/icons-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import InsightCard from './InsightCard';

const COLORS = ['#CEABB1', '#6366f1', '#7DCEA0'];

const ProductivityInsights = ({ data }) => {
  const formatHours = (seconds) => (seconds / 3600).toFixed(1);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-blackg-2 p-3 border border-text-white rounded-lg">
          <p className="text-white">{data.name}</p>
          <p className="text-white">
            {data.name.includes('Time') 
              ? `${formatHours(data.value)} hours`
              : `${data.value} tasks`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <InsightCard
      title="Productivity Insights"
      description="Analyze your study time distribution and task completion rates"
      icon={IconClock}
      dataExplanation={
        <div className="space-y-4">
          <div>
            <h4 className="text-white font-semibold mb-2">Data Structure</h4>
            <pre className="bg-black p-3 rounded-lg text-sm">
{`{
  productivity: [
    { name: string, value: number } // Study and break time in seconds
  ],
  completion: [
    { name: string, value: number } // Completed and incomplete tasks
  ]
}`}
            </pre>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Visualization Details</h4>
            <ul className="list-disc pl-4 space-y-2">
              <li>Left chart shows distribution of study vs break time</li>
              <li>Right chart shows task completion rates</li>
              <li>Hover over segments to see exact values</li>
            </ul>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-white font-medium mb-4">Time Distribution</h4>
          <div className="h-[250px]">
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
        <div>
          <h4 className="text-white font-medium mb-4">Task Completion</h4>
          <div className="h-[250px]">
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
                >
                  {data.completion.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </InsightCard>
  );
};

export default ProductivityInsights; 