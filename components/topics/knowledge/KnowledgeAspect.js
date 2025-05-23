"use client"
import { useState } from 'react';
import { IconStar, IconStarFilled } from '@tabler/icons-react';

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

export default KnowledgeAspect; 