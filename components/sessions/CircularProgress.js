import React, { useEffect, useState } from 'react';

const CircularProgress = ({ progress, size = 400, strokeWidth = 12, isBreak = false }) => {
  const [displayProgress, setDisplayProgress] = useState(progress);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (displayProgress / 100) * circumference;

  useEffect(() => {
    if (progress === 100) {
      // When progress reaches 100%, show full circle briefly then reset
      setDisplayProgress(100);
      const timer = setTimeout(() => {
        setDisplayProgress(0);
      }, 1000); // Reset after 1 second
      return () => clearTimeout(timer);
    } else {
      setDisplayProgress(progress);
    }
  }, [progress]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          className="text-black"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle with gradient */}
        <defs>
          {isBreak ? (
            <linearGradient id="breakGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4A90E2" />
              <stop offset="100%" stopColor="#9B51E0" />
            </linearGradient>
          ) : (
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#CEABB1" />
              <stop offset="100%" stopColor="#7DCEA0" />
            </linearGradient>
          )}
        </defs>
        <circle
          className="transition-all duration-1000 ease-linear"
          stroke={isBreak ? "url(#breakGradient)" : "url(#progressGradient)"}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            transformOrigin: 'center',
            transform: 'rotate(0deg)',
            transition: 'stroke-dashoffset 1s ease-in-out'
          }}
        />
      </svg>
    </div>
  );
};

export default CircularProgress; 