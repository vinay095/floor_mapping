import React, { useState } from 'react';
import { Circle, Text, Group, Path } from 'react-konva';
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

const SEAT_RADIUS = CELL_SIZE / 2 - 4; // Add a little padding

const SeatRenderer: React.FC<SeatRendererProps> = ({
  row,
  col,
  metadata,
  employee,
  onTooltipShow,
  onTooltipHide,
}) => {
  const [hovered, setHovered] = useState(false);

  // Center coordinates of the cell
  const cx = col * CELL_SIZE + CELL_SIZE / 2;
  const cy = row * CELL_SIZE + CELL_SIZE / 2;
  const isOccupied = !!employee;

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
    const container = stage?.container();
    if (container) container.style.cursor = 'pointer';
  };

  const handleMouseLeave = (e: any) => {
    setHovered(false);
    onTooltipHide();
    const container = e.target.getStage()?.container();
    if (container) container.style.cursor = 'default';
  };

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  // Colors based on the mockup
  const avatarBg = employee ? `hsl(${(employee.id * 47) % 360}, 70%, 45%)` : '#fff';
  
  return (
    <Group
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main Seat Circle */}
      <Circle
        x={cx}
        y={cy}
        radius={SEAT_RADIUS}
        fill={isOccupied ? avatarBg : '#FFFFFF'}
        stroke={isOccupied ? (hovered ? '#2563EB' : '#E5E7EB') : '#22C55E'}
        strokeWidth={isOccupied && hovered ? 2 : 1.5}
        shadowColor={hovered ? 'rgba(0,0,0,0.15)' : 'transparent'}
        shadowBlur={6}
        shadowOffset={{ x: 0, y: 2 }}
      />

      {isOccupied && employee ? (
        // Initials for occupied seat
        <Text
          x={cx - SEAT_RADIUS}
          y={cy - 5}
          width={SEAT_RADIUS * 2}
          text={getInitials(employee.name)}
          fontSize={10}
          fontFamily="Inter, sans-serif"
          fill="#FFFFFF"
          fontStyle="bold"
          align="center"
        />
      ) : (
        // Desk Icon for empty seat (drawn using a simple Path)
        // A little desk shape in green
        <Group x={cx - 7} y={cy - 6}>
          <Path
            data="M2,2 L12,2 L12,4 L2,4 Z M3,4 L3,10 M11,4 L11,10 M1,6 L13,6"
            stroke="#22C55E"
            strokeWidth={1.5}
            lineCap="round"
            lineJoin="round"
          />
        </Group>
      )}
    </Group>
  );
};

export default SeatRenderer;
