import React from 'react';

const SessionSettingsButton = ({
  icon: Icon,
  tooltip,
  showDropdown,
  onMouseEnter,
  onMouseLeave,
  dropdownContent,
  className = "text-pink hover:text-white transition-all duration-200 ease-in-out hover:scale-110 cursor-pointer"
}) => {
  return (
    <div 
      className="relative ml-4"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button
        className={className}
      >
        <Icon size={32} />
      </button>
      
      {tooltip && showDropdown && (
        <div className="absolute right-0 bottom-full mb-2 p-4 bg-black-3 rounded-lg shadow-lg w-64 z-50">
          {tooltip}
        </div>
      )}

      {dropdownContent && (
        <div
          className={`
            absolute right-0 bottom-full mb-2
            overflow-hidden bg-black p-2 rounded-lg
            transition-all duration-200 ease-out
            z-50
            ${showDropdown ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          {dropdownContent}
        </div>
      )}
    </div>
  );
};

export default SessionSettingsButton; 