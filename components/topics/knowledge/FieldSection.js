"use client"
import { useState } from 'react';
import { IconChevronUp, IconChevronDown } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import TopicCard from './TopicCard';

const FieldSection = ({ field, topics, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const averageRating = topics.reduce((acc, topic) => {
    return acc + (topic.theoretical + topic.practical + topic.problem_solving + topic.recent_practice) / 4;
  }, 0) / topics.length;

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-black-3 rounded-lg mb-4 hover:bg-black-4 transition-colors"
      >
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-white">{field}</h2>
          <div className="px-3 py-1 rounded-full text-sm font-medium bg-black-2">
            {topics.length} topics
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/60">Avg. Knowledge:</span>
            <span className="text-white">{averageRating.toFixed(1)}/5</span>
          </div>
        </div>
        {isExpanded ? <IconChevronUp size={24} className="text-white/60" /> : <IconChevronDown size={24} className="text-white/60" />}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onUpdate={onUpdate}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FieldSection; 