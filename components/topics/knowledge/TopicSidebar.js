"use client"
import { useState, useEffect, useRef } from 'react';
import { IconX } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import FieldSelector from './FieldSelector';
import KnowledgeAspect from './KnowledgeAspect';
import ResourceItem from './ResourceItem';

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

export default TopicSidebar; 