"use client"
import { useState, useEffect, useRef } from 'react';
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
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from '@mui/material';
import { allFields, searchFields } from '@/lib/fieldsOfStudy';

const KnowledgeAspect = ({ label, value, onChange }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-white/80">{label}</span>
        <span className="text-white">{value}/5</span>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => {
              setIsHovered(true);
              setHoverRating(star);
            }}
            onMouseLeave={() => {
              setIsHovered(false);
              setHoverRating(0);
            }}
            className="text-xl transition-colors duration-200"
          >
            {star <= (isHovered ? hoverRating : value) ? (
              <IconStarFilled className="text-yellow-400" />
            ) : (
              <IconStar className="text-white/40 hover:text-yellow-400" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

const ResourceItem = ({ resource, onDelete }) => (
  <div className="flex items-center justify-between bg-black-3 p-3 rounded-lg mb-2">
    <div className="flex items-center gap-3">
      <IconBook className="text-white/60" size={20} />
      <div>
        <h4 className="text-white font-medium">{resource.title}</h4>
        <p className="text-white/60 text-sm">{resource.type}</p>
      </div>
    </div>
    <button
      onClick={() => onDelete(resource.id)}
      className="text-white/40 hover:text-white"
    >
      ✕
    </button>
  </div>
);

const FieldSelector = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedField, setSelectedField] = useState(null);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (value) {
      const field = allFields.find(f => f.name === value);
      setSelectedField(field);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const filteredFields = search ? searchFields(search) : allFields;
  const groupedFields = filteredFields.reduce((acc, field) => {
    if (!acc[field.category]) {
      acc[field.category] = [];
    }
    acc[field.category].push(field);
    return acc;
  }, {});

  const handleSelect = (field) => {
    setSelectedField(field);
    onChange(field.name);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2 rounded-lg bg-mbg-2 border border-acc-1 text-white text-left flex items-center justify-between"
      >
        <span>{selectedField ? selectedField.name : 'Select a field'}</span>
        <IconChevronDown size={20} className="text-white/60" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-black border border-acc-1 rounded-lg shadow-lg"
          >
            <div className="p-2 border-b border-acc-1">
              <div className="relative">
                <IconSearch size={20} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white/60" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search fields..."
                  className="w-full pl-8 pr-4 py-2 bg-black-3 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink"
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {Object.entries(groupedFields).map(([category, fields]) => (
                <div key={category}>
                  <div className="px-4 py-2 bg-black text-white/60 text-sm font-medium sticky top-0">
                    {category}
                  </div>
                  {fields.map((field) => (
                    <button
                      key={field.name}
                      type="button"
                      onClick={() => handleSelect(field)}
                      className="w-full px-4 py-2 text-left hover:bg-black-3 transition-colors"
                    >
                      <div className="text-white">{field.name}</div>
                    </button>
                  ))}
                </div>
              ))}
              {Object.keys(groupedFields).length === 0 && (
                <div className="px-4 py-2 text-white/60 text-center">
                  No fields found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TopicCard = ({ topic, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(topic);

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

const TopicSidebar = ({ isOpen, onClose, onSave }) => {
  const sidebarRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    field: '',
    status: 'Not Started',
    theoretical: 1,
    practical: 1,
    problem_solving: 1,
    recent_practice: 1,
    resources: [],
    notes: ''
  });

  const [newResource, setNewResource] = useState({ title: '', type: '', url: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      name: '',
      description: '',
      field: '',
      status: 'Not Started',
      theoretical: 1,
      practical: 1,
      problem_solving: 1,
      recent_practice: 1,
      resources: [],
      notes: ''
    });
  };

  const addResource = () => {
    if (newResource.title && newResource.type) {
      setFormData({
        ...formData,
        resources: [...formData.resources, { ...newResource, id: Date.now() }]
      });
      setNewResource({ title: '', type: '', url: '' });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />
          <motion.div
            ref={sidebarRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[480px] bg-black border-l border-acc-1 p-6 overflow-y-auto z-50"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Add New Topic</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-pink transition-colors"
              >
                <IconX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white mb-1">Topic Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 rounded-lg bg-mbg-2 border border-acc-1 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 rounded-lg bg-mbg-2 border border-acc-1 text-white"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-white mb-1">Field of Study</label>
                <FieldSelector
                  value={formData.field}
                  onChange={(field) => setFormData({ ...formData, field })}
                />
              </div>

              <div>
                <label className="block text-white mb-1">Learning Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full p-2 rounded-lg bg-mbg-2 border border-acc-1 text-white"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Reviewing">Reviewing</option>
                  <option value="Mastered">Mastered</option>
                </select>
              </div>

              <div>
                <label className="block text-white mb-1">Knowledge Assessment</label>
                <div className="space-y-4 mt-2">
                  <KnowledgeAspect
                    label="Theoretical Understanding"
                    value={formData.theoretical}
                    onChange={(value) => setFormData({ ...formData, theoretical: value })}
                  />
                  <KnowledgeAspect
                    label="Practical Application"
                    value={formData.practical}
                    onChange={(value) => setFormData({ ...formData, practical: value })}
                  />
                  <KnowledgeAspect
                    label="Problem-Solving Ability"
                    value={formData.problem_solving}
                    onChange={(value) => setFormData({ ...formData, problem_solving: value })}
                  />
                  <KnowledgeAspect
                    label="Recent Practice"
                    value={formData.recent_practice}
                    onChange={(value) => setFormData({ ...formData, recent_practice: value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-1">Learning Resources</label>
                <div className="space-y-2">
                  {formData.resources.map((resource) => (
                    <ResourceItem
                      key={resource.id}
                      resource={resource}
                      onDelete={(id) => setFormData({
                        ...formData,
                        resources: formData.resources.filter(r => r.id !== id)
                      })}
                    />
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newResource.title}
                      onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                      placeholder="Resource title"
                      className="flex-1 p-2 rounded-lg bg-mbg-2 border border-acc-1 text-white"
                    />
                    <select
                      value={newResource.type}
                      onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                      className="w-32 p-2 rounded-lg bg-mbg-2 border border-acc-1 text-white"
                    >
                      <option value="">Type</option>
                      <option value="Book">Book</option>
                      <option value="Course">Course</option>
                      <option value="Paper">Paper</option>
                      <option value="Video">Video</option>
                      <option value="Other">Other</option>
                    </select>
                    <button
                      type="button"
                      onClick={addResource}
                      className="px-3 py-2 bg-pink text-white rounded-lg hover:bg-pink/80 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-white mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2 rounded-lg bg-mbg-2 border border-acc-1 text-white"
                  rows="3"
                  placeholder="Add any notes about this topic..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-pink text-white py-2 rounded-lg hover:bg-pink/80 transition-colors"
              >
                Add Topic
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

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