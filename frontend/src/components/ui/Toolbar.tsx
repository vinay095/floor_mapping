import React from 'react';
import { SettingOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';

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
      flexDirection: 'column',
      background: '#FFFFFF',
      border: '1px solid var(--color-border)',
      borderRadius: 8,
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      width: 36
    }}>
      <ToolBtn onClick={onReset} title="Settings/Reset">
        <SettingOutlined />
      </ToolBtn>
      <div style={{ height: 1, background: 'var(--color-border)', width: '100%' }} />
      <ToolBtn onClick={onZoomIn} title="Zoom in">
        <PlusOutlined />
      </ToolBtn>
      <div style={{ height: 1, background: 'var(--color-border)', width: '100%' }} />
      <ToolBtn onClick={onZoomOut} title="Zoom out">
        <MinusOutlined />
      </ToolBtn>
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
      border: 'none',
      color: 'var(--color-text-secondary)',
      width: 36,
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 14,
      cursor: 'pointer',
      transition: 'all 0.15s',
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLButtonElement).style.background = '#F9FAFB';
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
    }}
  >
    {children}
  </button>
);

export default Toolbar;
