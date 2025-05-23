"use client";

import { useState, useEffect, useRef } from 'react';
import { IconX } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Chip, OutlinedInput, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
// Assuming you have a file for topics data or fetch it from Supabase
// import { fetchTopics } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabaseClient';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      backgroundColor: '#1a1a1a', // Dark background for dropdown
      color: 'white', // White text for dropdown items
    },
  },
};

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

function getStyles(day, selectedDays, theme) {
  return {
    fontWeight:
      selectedDays.indexOf(day) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const ScheduleSidebar = ({ isOpen, onClose, onSave, editingSchedule, allTopics }) => {
  const sidebarRef = useRef(null);
  const theme = useTheme();
  const [formData, setFormData] = useState({
    topic_id: '',
    day_of_week: [],
    start_time: '09:00', // Default start time
    duration: 60, // Default duration in minutes
  });
  const { user } = useAuth();

  // Effect to close sidebar when clicking outside
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

  // Effect to populate form when editingSchedule changes
  useEffect(() => {
    if (editingSchedule) {
      // Convert numeric day_of_week back to names for the form
      const daysAsNames = editingSchedule.day_of_week.map(dayIndex => daysOfWeek[dayIndex]);
      setFormData({
        topic_id: editingSchedule.topic_id,
        day_of_week: daysAsNames,
        start_time: editingSchedule.start_time || '09:00', // Use default if somehow missing
        duration: editingSchedule.duration || 60, // Use default if somehow missing
      });
    } else {
      // Reset form for adding a new schedule
      setFormData({
        topic_id: '',
        day_of_week: [],
        start_time: '09:00',
        duration: 60,
      });
    }
  }, [editingSchedule]); // Depend on editingSchedule

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDaysChange = (event) => {
    const { value } = event.target;
    setFormData({
      ...formData,
      day_of_week: typeof value === 'string' ? value.split(',') : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    // Reset form after saving
    setFormData({
      topic_id: '',
      day_of_week: [],
      start_time: '09:00',
      duration: 60,
    });
  };

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
              <h2 className="text-2xl font-bold text-white">{editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-pink transition-colors"
              >
                <IconX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Topic Select */}
              <FormControl fullWidth>
                <InputLabel id="topic-select-label" sx={{ color: 'white' }}>Topic</InputLabel>
                <Select
                  labelId="topic-select-label"
                  id="topic-select"
                  name="topic_id"
                  value={formData.topic_id}
                  onChange={handleChange}
                  label="Topic"
                  required
                  sx={{
                    '.MuiOutlinedInput-notchedOutline': { borderColor: '#4A5568' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#E91E63' },
                    '.MuiSvgIcon-root': { color: 'white' },
                    color: 'white',
                  }}
                  MenuProps={MenuProps}
                >
                  {allTopics.map((topic) => (
                    <MenuItem
                      key={topic.id}
                      value={topic.id}
                      sx={{
                        '&:hover': { backgroundColor: 'rgba(233, 30, 99, 0.1)' },
                        '&.Mui-selected': { backgroundColor: 'rgba(233, 30, 99, 0.2)' },
                        '&.Mui-selected:hover': { backgroundColor: 'rgba(233, 30, 99, 0.3)' },
                      }}
                    >
                      {topic.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Days of Week Select */}
              <FormControl fullWidth>
                <InputLabel id="days-select-label" sx={{ color: 'white' }}>Days of Week</InputLabel>
                <Select
                  labelId="days-select-label"
                  id="days-select"
                  multiple
                  value={formData.day_of_week}
                  onChange={handleDaysChange}
                  input={<OutlinedInput id="select-multiple-chip" label="Days of Week" sx={{
                    '.MuiOutlinedInput-notchedOutline': { borderColor: '#4A5568' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#E91E63' },
                    '.MuiSvgIcon-root': { color: 'white' },
                    color: 'white',
                  }} />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} sx={{ backgroundColor: '#E91E63', color: 'white' }} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                  required
                  sx={{
                    '.MuiOutlinedInput-notchedOutline': { borderColor: '#4A5568' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#E91E63', },
                    '.MuiSvgIcon-root': { color: 'white' },
                    color: 'white',
                  }}
                >
                  {daysOfWeek.map((day) => (
                    <MenuItem
                      key={day}
                      value={day}
                      style={getStyles(day, formData.day_of_week, theme)}
                      sx={{
                        '&:hover': { backgroundColor: 'rgba(233, 30, 99, 0.1)' },
                        '&.Mui-selected': { backgroundColor: 'rgba(233, 30, 99, 0.2)' },
                        '&.Mui-selected:hover': { backgroundColor: 'rgba(233, 30, 99, 0.3)' },
                        color: 'white',
                      }}
                    >
                      {day}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Start Time */}
              <TextField
                label="Start Time"
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                  sx: { color: 'white' },
                }}
                InputProps={{
                  sx: {
                    '.MuiOutlinedInput-notchedOutline': { borderColor: '#4A5568' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#E91E63' },
                    '.MuiSvgIcon-root': { color: 'white' },
                    color: 'white',
                  }
                }}
                required
              />

              {/* Duration */}
              <TextField
                label="Duration (minutes)"
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                  sx: { color: 'white' },
                }}
                InputProps={{
                  sx: {
                    '.MuiOutlinedInput-notchedOutline': { borderColor: '#4A5568' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#E91E63' },
                    '.MuiSvgIcon-root': { color: 'white' },
                    color: 'white',
                  }
                }}
                required
                inputProps={{ min: 15, step: 15 }}
              />

              {/* Save Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 4,
                  backgroundColor: '#E91E63',
                  '&:hover': { backgroundColor: '#C2185B' },
                  color: 'white',
                  py: 1.5,
                  fontSize: '1rem',
                }}
              >
                Save Schedule
              </Button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ScheduleSidebar;
