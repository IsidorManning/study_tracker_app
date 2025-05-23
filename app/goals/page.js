"use client"
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { IconX, IconPlus, IconEdit, IconTrash, IconFilter, IconSearch, IconCalendar, IconChartBar } from '@tabler/icons-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, IconButton, Tooltip } from '@mui/material';
import SlideInSidebar from '@/components/SlideInSidebar';

const GoalSidebar = ({ isOpen, onClose, onSave, editingGoal }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal_type: 'weekly_hours',
    target_value: '',
    start_date: '',
    end_date: '',
    goal_status: 'active',
    ...editingGoal
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <SlideInSidebar
      isOpen={isOpen}
      onClose={onClose}
      title={editingGoal ? "Edit Goal" : "Create Goal"}
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-3 rounded-lg bg-black-3 text-white border border-white/20 focus:border-pink focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-3 rounded-lg bg-black-3 text-white border border-white/20 focus:border-pink focus:outline-none"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Goal Type
            </label>
            <select
              value={formData.goal_type}
              onChange={(e) => setFormData(prev => ({ ...prev, goal_type: e.target.value }))}
              className="w-full p-3 rounded-lg bg-black-3 text-white border border-white/20 focus:border-pink focus:outline-none"
            >
              <option value="weekly_hours">Weekly Study Hours</option>
              <option value="daily_hours">Daily Study Hours</option>
              <option value="topic_mastery">Topic Mastery</option>
              <option value="completion">Task Completion</option>
            </select>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Target Value
            </label>
            <input
              type="number"
              value={formData.target_value}
              onChange={(e) => setFormData(prev => ({ ...prev, target_value: e.target.value }))}
              className="w-full p-3 rounded-lg bg-black-3 text-white border border-white/20 focus:border-pink focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
              className="w-full p-3 rounded-lg bg-black-3 text-white border border-white/20 focus:border-pink focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              End Date
            </label>
            <input
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
              className="w-full p-3 rounded-lg bg-black-3 text-white border border-white/20 focus:border-pink focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Status
            </label>
            <select
              value={formData.goal_status}
              onChange={(e) => setFormData(prev => ({ ...prev, goal_status: e.target.value }))}
              className="w-full p-3 rounded-lg bg-black-3 text-white border border-white/20 focus:border-pink focus:outline-none"
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
            </select>
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="w-full py-3 px-6 rounded-lg bg-pink text-white font-medium hover:opacity-90 transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
          >
            <IconCalendar size={20} />
            {editingGoal ? "Update Goal" : "Create Goal"}
          </button>
        </div>
      </form>
    </SlideInSidebar>
  );
};

const DeleteConfirmationDialog = ({ isOpen, onClose, onConfirm, goalTitle }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-mbg-2 p-6 rounded-lg shadow-xl z-50 w-full max-w-md"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Delete Goal</h3>
            <p className="text-acc-2 mb-6">
              Are you sure you want to delete &quot;{goalTitle}&quot;? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-acc-2 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const GoalCard = ({ goal, onEdit, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const progress = (goal.current_value / goal.target_value) * 100;
  const daysRepinking = Math.ceil((new Date(goal.end_date) - new Date()) / (1000 * 60 * 60 * 24));

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-500';
      case 'completed':
        return 'bg-blue-500/20 text-blue-500';
      case 'paused':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'cancelled':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    await onDelete(goal.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
        className={`bg-mbg-2 p-4 rounded-lg border border-acc-1 hover:shadow-lg transition-shadow ${
          isDeleting ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-white">{goal.title}</h3>
            <p className="text-acc-2 text-sm mt-1">{goal.description}</p>
          </div>
          <div className="flex gap-2">
            <Tooltip title="Edit Goal">
              <IconButton
                onClick={() => onEdit(goal)}
                sx={{ 
                  color: 'white',
                  '&:hover': { 
                    bgcolor: 'rgba(206, 171, 177, 0.1)',
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <IconEdit size={20} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Goal">
              <IconButton
                onClick={handleDeleteClick}
                sx={{ 
                  color: '#EF4444',
                  '&:hover': { 
                    bgcolor: 'rgba(239, 68, 68, 0.1)',
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <IconTrash size={20} />
              </IconButton>
            </Tooltip>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-acc-2">Progress</span>
            <span className="text-white">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-mbg-3 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-pink h-2 rounded-full"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-acc-2">
            {goal.current_value} / {goal.target_value} hours
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.goal_status)}`}>
            {goal.goal_status.charAt(0).toUpperCase() + goal.goal_status.slice(1)}
          </span>
        </div>

        {daysRepinking > 0 && (
          <div className="mt-2 text-sm text-acc-2">
            {daysRepinking} days repinking
          </div>
        )}
      </motion.div>

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        goalTitle={goal.title}
      />
    </>
  );
};

const GoalStats = ({ goals }) => {
  const statusData = goals.reduce((acc, goal) => {
    acc[goal.goal_status] = (acc[goal.goal_status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(statusData).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count
  }));

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

  return (
    <div className="bg-mbg-2 p-4 rounded-lg border border-acc-1">
      <h3 className="text-lg font-semibold text-white mb-4">Goal Statistics</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const GoalProgressChart = ({ goals }) => {
  const chartData = goals.map(goal => ({
    name: goal.title,
    current: goal.current_value,
    target: goal.target_value
  }));

  return (
    <div className="bg-mbg-2 p-4 rounded-lg border border-acc-1">
      <h3 className="text-lg font-semibold text-white mb-4">Goal Progress</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="current" fill="#3B82F6" name="Current" />
            <Bar dataKey="target" fill="#10B981" name="Target" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default function GoalsPage() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('list'); // 'list' or 'stats'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchGoals = async () => {
    if (!user) {
      console.log('No user found, skipping fetch');
      return;
    }

    try {
      setError(null);
      console.log('Fetching goals for user:', user.id);
      
      const { data, error } = await supabase
        .from('study_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        setError(error.message || 'Failed to fetch goals');
        throw error;
      }

      console.log('Successfully fetched goals:', data);
      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching goals:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      setError(error.message || 'Failed to fetch goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [user]);

  const handleSaveGoal = async (goalData) => {
    if (!user) {
      setError('You must be logged in to save goals');
      return;
    }

    try {
      setError(null);
      console.log('Saving goal:', goalData);

      if (editingGoal) {
        const { error } = await supabase
          .from('study_goals')
          .update(goalData)
          .eq('id', editingGoal.id);

        if (error) {
          console.error('Supabase update error:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          setError(error.message || 'Failed to update goal');
          throw error;
        }
      } else {
        const { error } = await supabase
          .from('study_goals')
          .insert([{ ...goalData, user_id: user.id }]);

        if (error) {
          console.error('Supabase insert error:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          setError(error.message || 'Failed to create goal');
          throw error;
        }
      }

      console.log('Goal saved successfully');
      await fetchGoals();
      setIsSidebarOpen(false);
      setEditingGoal(null);
    } catch (error) {
      console.error('Error saving goal:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      setError(error.message || 'Failed to save goal');
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!user) {
      setError('You must be logged in to delete goals');
      return;
    }

    try {
      setError(null);
      console.log('Deleting goal:', goalId);

      const { error } = await supabase
        .from('study_goals')
        .delete()
        .eq('id', goalId);

      if (error) {
        console.error('Supabase delete error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        setError(error.message || 'Failed to delete goal');
        throw error;
      }

      console.log('Goal deleted successfully');
      await fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      setError(error.message || 'Failed to delete goal');
    }
  };

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || goal.goal_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-8 pt-24">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8 pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Goals</h1>
          <div className="flex gap-4">
            <Tooltip title={view === 'list' ? 'View Statistics' : 'View List'}>
              <IconButton
                onClick={() => setView(view === 'list' ? 'stats' : 'list')}
                sx={{ 
                  color: 'white',
                  '&:hover': { 
                    bgcolor: 'rgba(206, 171, 177, 0.1)',
                    color: '#CEABB1',
                    transform: 'scale(1.1)'
                  }
                }}
              >
                {view === 'list' ? <IconChartBar size={20} /> : <IconCalendar size={20} />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Create New Goal">
              <IconButton
                onClick={() => {
                  setEditingGoal(null);
                  setIsSidebarOpen(true);
                }}
                sx={{ 
                  color: 'white',
                  '&:hover': { 
                    bgcolor: 'rgba(206, 171, 177, 0.1)',
                    color: '#CEABB1',
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <IconPlus size={24} />
              </IconButton>
            </Tooltip>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-acc-1/10 text-acc-1 rounded-lg">
            {error}
          </div>
        )}

        {view === 'list' ? (
          <>
            <div className="flex gap-4 mb-6 items-center">
              <div className="flex-1 relative group">
                <input
                  type="text"
                  placeholder="Search goals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 pl-10 bg-transparent border-b border-white text-white focus:outline-none focus:border-pink transition-colors"
                  style={{ color: 'white' }}
                />
                <IconSearch className="absolute left-2 top-2.5 text-acc-2 group-focus-within:text-pink transition-colors" size={20} />
              </div>
              <div className="relative group">
                <Tooltip title="Filter by Status">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none p-2 pl-10 pr-8 bg-transparent border-b border-acc-1/30 text-white focus:outline-none focus:border-pink transition-colors cursor-pointer"
                    style={{ color: 'white' }}
                  >
                    <option value="all" style={{ color: 'white', backgroundColor: '#1a1a1a' }}>All</option>
                    <option value="active" style={{ color: 'white', backgroundColor: '#1a1a1a' }}>Active</option>
                    <option value="completed" style={{ color: 'white', backgroundColor: '#1a1a1a' }}>Completed</option>
                    <option value="paused" style={{ color: 'white', backgroundColor: '#1a1a1a' }}>Paused</option>
                    <option value="cancelled" style={{ color: 'white', backgroundColor: '#1a1a1a' }}>Cancelled</option>
                  </select>
                </Tooltip>
                <IconFilter className="absolute left-2 top-2.5 text-acc-2 group-focus-within:text-pink transition-colors" size={20} />
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onEdit={(goal) => {
                      setEditingGoal(goal);
                      setIsSidebarOpen(true);
                    }}
                    onDelete={handleDeleteGoal}
                  />
                ))}
              </div>
            </AnimatePresence>
          </>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GoalStats goals={goals} />
            <GoalProgressChart goals={goals} />
          </div>
        )}

        <GoalSidebar
          isOpen={isSidebarOpen}
          onClose={() => {
            setIsSidebarOpen(false);
            setEditingGoal(null);
          }}
          onSave={handleSaveGoal}
          editingGoal={editingGoal}
        />
      </div>
    </div>
  );
}