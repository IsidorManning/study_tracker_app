"use client"
import { IconBook } from '@tabler/icons-react';

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

export default ResourceItem; 