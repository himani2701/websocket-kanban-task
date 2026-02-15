import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2 } from 'lucide-react';

export default function TaskCard({ task, onDelete }) {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition, 
    isDragging 
  } = useSortable({ id: task.id });

  // Visual helper for priority-based color coding [cite: 2026-02-15]
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High': return { bg: '#fee2e2', text: '#ef4444', border: '#fecaca' };
      case 'Medium': return { bg: '#fef3c7', text: '#d97706', border: '#fde68a' };
      case 'Low': return { bg: '#dcfce7', text: '#16a34a', border: '#bbf7d0' };
      default: return { bg: '#f1f5f9', text: '#64748b', border: '#e2e8f0' };
    }
  };

  const pStyle = getPriorityStyle(task.priority);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners} 
      className="task-card"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="category-tag">INTERNAL</span>
          
          {/* Priority Badge with high-contrast text [cite: 2026-02-15] */}
          <span style={{ 
            backgroundColor: pStyle.bg,
            color: pStyle.text,
            border: `1px solid ${pStyle.border}`,
            fontSize: '10px',
            padding: '2px 8px',
            borderRadius: '20px',
            fontWeight: '800',
            textTransform: 'uppercase'
          }}>
            {task.priority || 'Medium'}
          </span>
        </div>
        
        {/* Pointer event suppression prevents drag activation on button click [cite: 2026-02-15] */}
        <button 
          onPointerDown={(e) => e.stopPropagation()} 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="delete-btn"
          aria-label="Delete task"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <h4 className="task-title" style={{ margin: '8px 0', color: '#000000' }}>
        {task.title}
      </h4>
      
      <div className="card-footer" style={{ marginTop: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
        <span className="timestamp" style={{ fontSize: '10px', color: '#94a3b8' }}>
          ID: {task.id.slice(-4)}
        </span>
      </div>
    </div>
  );
}