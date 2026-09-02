import React from 'react';
import type { Team } from '../../types/employee.types';

interface LegendProps {
  teams: Team[];
  totalSeats: number;
  occupiedSeats: number;
}

const Legend: React.FC<LegendProps> = ({ teams, totalSeats, occupiedSeats }) => {
  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.9)',
      border: '1px solid #1E293B',
      borderRadius: 10,
      padding: '12px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      minWidth: 170,
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        Legend
      </div>

      {/* Seat states */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <LegendItem color="#1D4ED8" label="Occupied seat" />
        <LegendItem color="#1E293B" label="Empty seat" border="#334155" />
      </div>

      <div style={{ borderTop: '1px solid #1E293B', paddingTop: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
          Teams
        </div>
        {teams.map(team => (
          <LegendItem key={team.id} color={team.color} label={team.name} opacity={0.15} />
        ))}
      </div>

      {/* Stats */}
      <div style={{ borderTop: '1px solid #1E293B', paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <StatRow label="Total Seats" value={totalSeats} />
        <StatRow label="Occupied" value={occupiedSeats} color="#3B82F6" />
        <StatRow label="Available" value={totalSeats - occupiedSeats} color="#10B981" />
      </div>
    </div>
  );
};

const LegendItem: React.FC<{ color: string; label: string; border?: string; opacity?: number }> = ({
  color, label, border, opacity = 1
}) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <div style={{
      width: 14,
      height: 14,
      borderRadius: 3,
      background: color,
      opacity,
      border: border ? `1px solid ${border}` : undefined,
      flexShrink: 0,
    }} />
    <span style={{ fontSize: 12, color: '#94A3B8' }}>{label}</span>
  </div>
);

const StatRow: React.FC<{ label: string; value: number; color?: string }> = ({ label, value, color }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span style={{ fontSize: 11, color: '#64748B' }}>{label}</span>
    <span style={{ fontSize: 12, fontWeight: 600, color: color ?? '#F1F5F9' }}>{value}</span>
  </div>
);

export default Legend;
