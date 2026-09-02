import React from 'react';

interface ToolbarProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  currentZoom: number;
}

const Toolbar: React.FC<ToolbarProps> = ({ onZoomIn, onZoomOut, onReset, currentZoom }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      background: 'rgba(15, 23, 42, 0.9)',
      border: '1px solid #1E293B',
      borderRadius: 10,
      padding: '6px 10px',
      backdropFilter: 'blur(10px)',
    }}>
      <ToolBtn onClick={onZoomIn} title="Zoom in">＋</ToolBtn>
      <span style={{ fontSize: 12, color: '#64748B', minWidth: 40, textAlign: 'center' }}>
        {Math.round(currentZoom * 100)}%
      </span>
      <ToolBtn onClick={onZoomOut} title="Zoom out">－</ToolBtn>
      <div style={{ width: 1, height: 20, background: '#1E293B', margin: '0 4px' }} />
      <ToolBtn onClick={onReset} title="Reset view">⊙</ToolBtn>
    </div>
  );
};

const ToolBtn: React.FC<{ onClick: () => void; title: string; children: React.ReactNode }> = ({
  onClick, title, children
}) => (
  <button
    onClick={onClick}
    title={title}
    style={{
      background: 'transparent',
      border: '1px solid #1E293B',
      borderRadius: 6,
      color: '#94A3B8',
      width: 30,
      height: 30,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 16,
      cursor: 'pointer',
      transition: 'all 0.15s',
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLButtonElement).style.background = '#1E293B';
      (e.currentTarget as HTMLButtonElement).style.color = '#F1F5F9';
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
      (e.currentTarget as HTMLButtonElement).style.color = '#94A3B8';
    }}
  >
    {children}
  </button>
);

export default Toolbar;
