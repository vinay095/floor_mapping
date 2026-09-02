import React from 'react';
import { Layer, Rect, Text, Group } from 'react-konva';
import type { Employee } from '../../types/employee.types';

interface TooltipLayerProps {
  visible: boolean;
  x: number;
  y: number;
  employee?: Employee;
  seatCode?: string;
  stageWidth: number;
  stageHeight: number;
}

const TOOLTIP_WIDTH = 200;
const TOOLTIP_HEIGHT = 110;
const TOOLTIP_PADDING = 12;

const TooltipLayer: React.FC<TooltipLayerProps> = ({
  visible,
  x,
  y,
  employee,
  seatCode,
  stageWidth,
}) => {
  if (!visible || !employee) return null;

  // Keep tooltip within stage bounds
  let tx = x + 12;
  let ty = y - TOOLTIP_HEIGHT - 12;
  if (tx + TOOLTIP_WIDTH > stageWidth) tx = x - TOOLTIP_WIDTH - 12;
  if (ty < 0) ty = y + 20;

  const teamColors: Record<string, string> = {
    Engineering: '#3B82F6',
    Product: '#10B981',
    Design: '#8B5CF6',
    'Data & Analytics': '#F59E0B',
    DevOps: '#EF4444',
    QA: '#06B6D4',
  };
  const teamColor = teamColors[employee.teamName] ?? '#94A3B8';

  return (
    <Layer listening={false}>
      <Group x={tx} y={ty}>
        {/* Shadow */}
        <Rect
          x={2}
          y={4}
          width={TOOLTIP_WIDTH}
          height={TOOLTIP_HEIGHT}
          fill="rgba(0,0,0,0.15)"
          cornerRadius={8}
          blur={10}
        />
        {/* Background */}
        <Rect
          width={TOOLTIP_WIDTH}
          height={TOOLTIP_HEIGHT}
          fill="#FFFFFF"
          stroke="#E5E7EB"
          strokeWidth={1}
          cornerRadius={8}
        />
        {/* Top accent bar */}
        <Rect
          width={TOOLTIP_WIDTH}
          height={4}
          fill={teamColor}
          cornerRadius={[8, 8, 0, 0]}
        />

        {/* Employee name */}
        <Text
          x={TOOLTIP_PADDING}
          y={14}
          width={TOOLTIP_WIDTH - TOOLTIP_PADDING * 2}
          text={employee.name}
          fontSize={13}
          fontStyle="bold"
          fontFamily="Inter, sans-serif"
          fill="#1F2937"
        />

        {/* Designation */}
        <Text
          x={TOOLTIP_PADDING}
          y={32}
          width={TOOLTIP_WIDTH - TOOLTIP_PADDING * 2}
          text={employee.designation}
          fontSize={11}
          fontFamily="Inter, sans-serif"
          fill="#6B7280"
        />

        {/* Team badge */}
        <Rect
          x={TOOLTIP_PADDING}
          y={52}
          width={employee.teamName.length * 6.5 + 12}
          height={18}
          fill={`${teamColor}15`}
          stroke={teamColor}
          strokeWidth={1}
          cornerRadius={4}
        />
        <Text
          x={TOOLTIP_PADDING + 6}
          y={56}
          text={employee.teamName}
          fontSize={10}
          fontFamily="Inter, sans-serif"
          fill={teamColor}
          fontStyle="600"
        />

        {/* Seat info */}
        <Text
          x={TOOLTIP_PADDING}
          y={78}
          text={`📍 Seat: ${seatCode ?? '—'}`}
          fontSize={11}
          fontFamily="Inter, sans-serif"
          fill="#4B5563"
        />

        {/* Email */}
        <Text
          x={TOOLTIP_PADDING}
          y={93}
          width={TOOLTIP_WIDTH - TOOLTIP_PADDING * 2}
          text={employee.email}
          fontSize={10}
          fontFamily="Inter, sans-serif"
          fill="#9CA3AF"
          ellipsis
        />
      </Group>
    </Layer>
  );
};

export default TooltipLayer;
