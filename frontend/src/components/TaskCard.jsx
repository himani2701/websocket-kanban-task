import React from 'react';
import { Trash2, Paperclip, ImageIcon } from 'lucide-react';

function TaskCard({ task, onUpdate, onDelete }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simulating backend storage as per requirements
      const fileUrl = URL.createObjectURL(file);
      onUpdate({ ...task, attachments: [...task.attachments, { name: file.name, url: fileUrl }] });
    }
  };

  return (
    <div className="bg-white p-4 mb-3 rounded shadow-sm border-l-4 border-blue-500 group">
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-gray-800">{task.title}</h4>
        <button onClick={() => onDelete(task.id)} className="text-gray-300 hover:text-red-500 transition-colors">
          <Trash2 size={16} />
        </button>
      </div>

      
      <div className="mt-3 flex gap-2">
        <select 
          value={task.priority} 
          onChange={(e) => onUpdate({ ...task, priority: e.target.value })}
          className="text-xs bg-gray-100 border-none rounded p-1 cursor-pointer"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select 
          value={task.category} 
          onChange={(e) => onUpdate({ ...task, category: e.target.value })}
          className="text-xs bg-gray-100 border-none rounded p-1 cursor-pointer"
        >
          <option value="Bug">Bug</option>
          <option value="Feature">Feature</option>
          <option value="Enhancement">Enhancement</option>
        </select>
      </div>

      
      <div className="mt-4 pt-3 border-t border-gray-50">
        <label className="flex items-center gap-2 text-xs text-blue-600 cursor-pointer hover:underline">
          <Paperclip size={12} />
          <span>Attach File</span>
          <input type="file" className="hidden" onChange={handleFileChange} />
        </label>

        
        <div className="mt-2 flex flex-wrap gap-2">
          {task.attachments?.map((file, i) => (
            <div key={i} className="group relative">
              <a href={file.url} target="_blank" rel="noreferrer" title={file.name}>
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center border border-gray-200">
                  <ImageIcon size={14} className="text-gray-400" />
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TaskCard;  