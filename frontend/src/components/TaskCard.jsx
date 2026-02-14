import React from 'react';
import { Trash2, ExternalLink } from 'lucide-react';

export default function TaskCard({ task, onDelete }) {
  const styles = {
    card: {
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '16px',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      cursor: 'grab'
    }
  };

  return (
    <div style={styles.card} className="nebula-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }}></div>
          <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>{task.category || 'Internal'}</span>
        </div>
        <button onClick={() => onDelete(task.id)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}>
          <Trash2 size={16} />
        </button>
      </div>
      <h4 style={{ margin: '0 0 15px 0', fontSize: '15px', lineHeight: '1.5' }}>{task.title}</h4>
      <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <ExternalLink size={12} />
        <span>Click to expand details</span>
      </div>
      <style>{`
        .nebula-card:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          transform: translateY(-5px);
          border-color: rgba(56, 189, 248, 0.5) !important;
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
}