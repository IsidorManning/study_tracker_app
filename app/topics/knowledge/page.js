"use client"
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { 
  IconStar, 
  IconStarFilled, 
  IconPlus, 
  IconBook, 
  IconLink,
  IconNotes,
  IconChevronDown,
  IconChevronUp,
  IconX,
  IconSearch
} from '@tabler/icons-react';
import { Tooltip } from '@mui/material';
import TopicSidebar from '@/components/topics/knowledge/TopicSidebar';
import FieldSection from '@/components/topics/knowledge/FieldSection';


const DUMMY_TOPICS = [
  {
    id: 1,
    name: "Linear Algebra",
    description: "Vector spaces, matrices, and linear transformations",
    field: "Mathematics",
    status: "In Progress",
    theoretical: 4,
    practical: 3,
    problem_solving: 3,
    recent_practice: 4,
    resources: [
      { id: 1, title: "Linear Algebra Done Right", type: "Book" },
      { id: 2, title: "3Blue1Brown Linear Algebra Series", type: "Video" }
    ],
    notes: "Focus on understanding eigenvectors and eigenvalues better"
  },
  {
    id: 2,
    name: "Quantum Mechanics",
    description: "Wave functions, operators, and quantum states",
    field: "Physics",
    status: "Not Started",
    theoretical: 2,
    practical: 1,
    problem_solving: 1,
    recent_practice: 1,
    resources: [
      { id: 1, title: "Introduction to Quantum Mechanics", type: "Book" }
    ],
    notes: "Need to review classical mechanics first"
  },
  {
    id: 3,
    name: "Deep Learning",
    description: "Neural networks, backpropagation, and optimization",
    field: "Computer Science",
    status: "Reviewing",
    theoretical: 4,
    practical: 5,
    problem_solving: 4,
    recent_practice: 5,
    resources: [
      { id: 1, title: "Deep Learning Book", type: "Book" },
      { id: 2, title: "CS231n", type: "Course" }
    ],
    notes: "Strong in practical applications, need to review theoretical foundations"
  },
  {
    id: 4,
    name: "Differential Equations",
    description: "Ordinary and partial differential equations",
    field: "Mathematics",
    status: "In Progress",
    theoretical: 3,
    practical: 2,
    problem_solving: 3,
    recent_practice: 2,
    resources: [
      { id: 1, title: "Differential Equations and Their Applications", type: "Book" }
    ],
    notes: "Working on solving more complex PDEs"
  }
];

export default function TopicsKnowledgePage() {
  const { user } = useAuth();
  const [topics, setTopics] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [useDummyData, setUseDummyData] = useState(true);

  useEffect(() => {
    if (user) {
      if (useDummyData) {
        setTopics(DUMMY_TOPICS);
        setLoading(false);
      } else {
        fetchTopics();
      }
    }
  }, [user, useDummyData]);

  const fetchTopics = async () => {
    try {
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTopics(data || []);
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTopic = async (topicData) => {
    try {
      const transformedData = {
        user_id: user.id,
        name: topicData.name,
        description: topicData.description,
        field: topicData.field,
        status: topicData.status,
        theoretical: topicData.theoretical,
        practical: topicData.practical,
        problem_solving: topicData.problem_solving,
        recent_practice: topicData.recent_practice,
        resources: topicData.resources || [],
        notes: topicData.notes
      };

      const { error } = await supabase
        .from('topics')
        .insert([transformedData]);

      if (error) throw error;
      setIsSidebarOpen(false);
      fetchTopics();
    } catch (error) {
      console.error('Error saving topic:', error);
    }
  };

  const handleUpdateTopic = async (topicId, updatedData) => {
    try {
      const transformedData = {
        name: updatedData.name,
        description: updatedData.description,
        field: updatedData.field,
        status: updatedData.status,
        theoretical: updatedData.theoretical,
        practical: updatedData.practical,
        problem_solving: updatedData.problem_solving,
        recent_practice: updatedData.recent_practice,
        resources: updatedData.resources || [],
        notes: updatedData.notes
      };

      const { error } = await supabase
        .from('topics')
        .update(transformedData)
        .eq('id', topicId)
        .eq('user_id', user.id);

      if (error) throw error;
      fetchTopics();
    } catch (error) {
      console.error('Error updating topic:', error);
    }
  };

  const topicsByField = topics.reduce((acc, topic) => {
    if (!acc[topic.field]) {
      acc[topic.field] = [];
    }
    acc[topic.field].push(topic);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-10 xl:p-40">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Topic Knowledge</h1>
          <p className="text-white/60">
            Track your knowledge level across different topics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Tooltip title="Toggle dummy data" placement="left">
            <button
              onClick={() => setUseDummyData(!useDummyData)}
              className="p-2 rounded-lg hover:bg-black-3 transition-colors"
            >
              <IconBook size={24} className="text-white" />
            </button>
          </Tooltip>
          <Tooltip title="Add new topic" placement="left">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-black-3 transition-colors"
            >
              <IconPlus size={24} className="text-white" />
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(topicsByField).map(([field, fieldTopics]) => (
          <FieldSection
            key={field}
            field={field}
            topics={fieldTopics}
            onUpdate={handleUpdateTopic}
          />
        ))}
      </div>

      <TopicSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSave={handleSaveTopic}
      />
    </main>
  );
} 