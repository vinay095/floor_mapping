import React, { useState } from 'react';
import { Rect, Text, Group } from 'react-konva';
import { CELL_SIZE } from '../../constants/layout';
import type { Employee } from '../../types/employee.types';
import type { SeatMetadata } from '../../types/seat.types';

interface TooltipInfo {
  x: number;
  y: number;
  employee: Employee;
  seatCode: string;
}

interface SeatRendererProps {
  row: number;
  col: number;
  metadata: SeatMetadata;
  employee?: Employee;
  onTooltipShow: (info: TooltipInfo) => void;
  onTooltipHide: () => void;
}

const SEAT_PADDING = 3;
const SEAT_SIZE = CELL_SIZE - SEAT_PADDING * 2;
const CORNER_RADIUS = 6;

// Color palette
const COLORS = {
  emptyFill: '#1E293B',
  emptyStroke: '#334155',
  occupiedFill: '#1D4ED8',
  occupiedStroke: '#3B82F6',
  occupiedGlow: '#60A5FA',
  codeText: '#94A3B8',
  nameText: '#F0F9FF',
  hoverEmpty: '#2D3F55',
  hoverOccupied: '#2563EB',
};

const SeatRenderer: React.FC<SeatRendererProps> = ({
  row,
  col,
  metadata,
  employee,
  onTooltipShow,
  onTooltipHide,
}) => {
  const [hovered, setHovered] = useState(false);

  const x = col * CELL_SIZE + SEAT_PADDING;
  const y = row * CELL_SIZE + SEAT_PADDING;
  const isOccupied = !!employee;

  const fill = isOccupied
    ? hovered ? COLORS.hoverOccupied : COLORS.occupiedFill
    : hovered ? COLORS.hoverEmpty : COLORS.emptyFill;

  const stroke = isOccupied ? COLORS.occupiedStroke : COLORS.emptyStroke;

  const handleMouseEnter = (e: any) => {
    setHovered(true);
    const stage = e.target.getStage();
    if (employee && stage) {
      const pointer = stage.getPointerPosition();
      if (pointer) {
        onTooltipShow({
          x: pointer.x,
          y: pointer.y,
          employee,
          seatCode: metadata.seatCode,
        });
      }
    }
    // Change cursor
    const container = stage?.container();
    if (container) container.style.cursor = 'pointer';
  };

  const handleMouseLeave = (e: any) => {
    setHovered(false);
    onTooltipHide();
    const container = e.target.getStage()?.container();
    if (container) container.style.cursor = 'default';
  };

  // Get employee initials for avatar
  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <Group
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Seat background */}
      <Rect
        x={x}
        y={y}
        width={SEAT_SIZE}
        height={SEAT_SIZE}
        fill={fill}
        stroke={stroke}
        strokeWidth={isOccupied ? 1.5 : 1}
        cornerRadius={CORNER_RADIUS}
        shadowColor={isOccupied ? COLORS.occupiedGlow : undefined}
        shadowBlur={isOccupied && hovered ? 10 : 0}
        shadowOpacity={0.5}
      />

      {/* Seat code — top left */}
      <Text
        x={x + 4}
        y={y + 4}
        text={metadata.seatCode}
        fontSize={9}
        fontFamily="Inter, sans-serif"
        fill={COLORS.codeText}
        fontStyle="600"
      />

      {isOccupied && employee ? (
        <>
          {/* Avatar circle */}
          <Rect
            x={x + SEAT_SIZE / 2 - 12}
            y={y + 14}
            width={24}
            height={24}
            fill={`hsl(${(employee.id * 47) % 360}, 70%, 55%)`}
            cornerRadius={12}
          />
          {/* Initials */}
          <Text
            x={x + SEAT_SIZE / 2 - 12}
            y={y + 20}
            width={24}
            text={getInitials(employee.name)}
            fontSize={9}
            fontFamily="Inter, sans-serif"
            fill="#ffffff"
            fontStyle="bold"
            align="center"
          />
          {/* Employee first name */}
          <Text
            x={x + 2}
            y={y + SEAT_SIZE - 16}
            width={SEAT_SIZE - 4}
            text={employee.name.split(' ')[0]}
            fontSize={9}
            fontFamily="Inter, sans-serif"
            fill={COLORS.nameText}
            align="center"
            ellipsis
          />
        </>
      ) : (
        // Empty label
        <Text
          x={x}
          y={y + SEAT_SIZE / 2 - 6}
          width={SEAT_SIZE}
          text="Empty"
          fontSize={9}
          fontFamily="Inter, sans-serif"
          fill="#475569"
          align="center"
        />
      )}
    </Group>
  );
};

export type { TooltipInfo };
export default SeatRenderer;
