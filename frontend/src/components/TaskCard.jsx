import React from 'react';
import { Trash2, AlertCircle, Tag } from 'lucide-react';

const PRIORITY_COLORS = {
  High: 'text-red-600 bg-red-100',
  Medium: 'text-yellow-600 bg-yellow-100',
  Low: 'text-green-600 bg-green-100',
};

export default function TaskCard({ task, onUpdate, onDelete }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-2">
        {/* Priority Badge */}
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${PRIORITY_COLORS[task.priority]}`}>
          {task.priority}
        </span>
        
        {/* Delete Button - only shows on hover for a cleaner look */}
        <button 
          onClick={() => onDelete(task.id)}
          className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <h3 className="font-semibold text-gray-800 mb-3">{task.title}</h3>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
        <div className="flex items-center gap-1.5 text-gray-500">
          <Tag size={14} />
          <span className="text-xs">{task.category}</span>
        </div>
        
        <div className="flex items-center gap-1 text-gray-400">
          <AlertCircle size={14} />
          <span className="text-[10px]">ID: {task.id.substring(0, 4)}</span>
        </div>
      </div>
    </div>
  );
}