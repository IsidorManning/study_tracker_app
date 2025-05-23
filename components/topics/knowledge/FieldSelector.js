"use client"
import { useState, useEffect, useRef } from 'react';
import { IconChevronDown, IconSearch } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { allFields, searchFields } from '@/lib/fieldsOfStudy';

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

export default FieldSelector; 