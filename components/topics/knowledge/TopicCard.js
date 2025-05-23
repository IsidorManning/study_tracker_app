"use client"
import { useState, useEffect } from 'react';
import { IconChevronUp, IconChevronDown } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import KnowledgeAspect from './KnowledgeAspect';
import ResourceItem from './ResourceItem';

const TopicCard = ({ topic, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(topic);
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStudyTime = async () => {
      if (!user || !topic.topic_id) return;

      try {
        const { data, error } = await supabase
          .from('study_sessions')
          .select('total_seconds')
          .eq('user_id', user.id)
          .eq('topic_id', topic.topic_id);

        if (error) throw error;

        const totalSeconds = data.reduce((sum, session) => sum + (session.total_seconds || 0), 0);
        setTotalStudyTime(totalSeconds);
      } catch (error) {
        console.error('Error fetching study time:', error);
      }
    };

    fetchStudyTime();
  }, [user, topic.topic_id]);

  const formatStudyTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handleSave = async () => {
    await onUpdate(topic.id, editData);
    setIsEditing(false);
  };

  const averageRating = (
    (topic.theoretical + topic.practical + topic.problem_solving + topic.recent_practice) / 4
  ).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black-2 rounded-lg border border-acc-1 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-white">{topic.name}</h3>
            <p className="text-white/60 mt-1">{topic.description}</p>
            <div className="text-white/60 text-sm mt-2">
              Study Time: {formatStudyTime(totalStudyTime)}
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white/60 hover:text-white"
          >
            {isExpanded ? <IconChevronUp size={24} /> : <IconChevronDown size={24} />}
          </button>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-acc-2">Overall Knowledge</span>
              <span className="text-white">{averageRating}/5</span>
            </div>
            <div className="w-full bg-mbg-3 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(averageRating / 5) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-yellow-400 h-2 rounded-full"
              />
            </div>
          </div>
          <div className="px-3 py-1 rounded-full text-sm font-medium"
               style={{
                 backgroundColor: 
                   topic.status === 'Not Started' ? '#4B5563' :
                   topic.status === 'In Progress' ? '#3B82F6' :
                   topic.status === 'Reviewing' ? '#8B5CF6' :
                   '#10B981'
               }}>
            {topic.status}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-6 space-y-6">
            {isEditing ? (
              <div className="space-y-4">
                <KnowledgeAspect
                  label="Theoretical Understanding"
                  value={editData.theoretical}
                  onChange={(value) => setEditData({ ...editData, theoretical: value })}
                />
                <KnowledgeAspect
                  label="Practical Application"
                  value={editData.practical}
                  onChange={(value) => setEditData({ ...editData, practical: value })}
                />
                <KnowledgeAspect
                  label="Problem-Solving Ability"
                  value={editData.problem_solving}
                  onChange={(value) => setEditData({ ...editData, problem_solving: value })}
                />
                <KnowledgeAspect
                  label="Recent Practice"
                  value={editData.recent_practice}
                  onChange={(value) => setEditData({ ...editData, recent_practice: value })}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-pink text-white py-2 rounded-lg hover:bg-pink/80 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setEditData(topic);
                      setIsEditing(false);
                    }}
                    className="flex-1 bg-black-3 text-white py-2 rounded-lg hover:bg-black-4 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">Knowledge Aspects</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Theoretical</span>
                        <span className="text-white">{topic.theoretical}/5</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Practical</span>
                        <span className="text-white">{topic.practical}/5</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Problem-Solving</span>
                        <span className="text-white">{topic.problem_solving}/5</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Recent Practice</span>
                        <span className="text-white">{topic.recent_practice}/5</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-4 text-pink hover:text-pink/80 transition-colors"
                    >
                      Edit Ratings
                    </button>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-2">Learning Resources</h4>
                    {topic.resources?.length > 0 ? (
                      <div className="space-y-2">
                        {topic.resources.map((resource) => (
                          <ResourceItem
                            key={resource.id}
                            resource={resource}
                            onDelete={(id) => onUpdate(topic.id, {
                              ...topic,
                              resources: topic.resources.filter(r => r.id !== id)
                            })}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-white/60 text-sm">No resources added yet</p>
                    )}
                  </div>
                </div>
                {topic.notes && (
                  <div className="mt-4">
                    <h4 className="text-white font-medium mb-2">Notes</h4>
                    <p className="text-white/80 text-sm">{topic.notes}</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TopicCard; 