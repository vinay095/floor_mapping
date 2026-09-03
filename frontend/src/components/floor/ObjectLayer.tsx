import React from 'react';
import { Layer, Rect, Line, Text, Group } from 'react-konva';
import { CellType } from '../../constants/cellTypes';
import { CELL_SIZE } from '../../constants/layout';
import type { MatrixLayout } from '../../types/floor.types';

interface ObjectLayerProps {
  layout: MatrixLayout;
}

const colorMap: Record<string, string> = {
  [CellType.NAMED_OFFICE]: '#E0E7FF',   // Light Indigo
  [CellType.HR_OFFICE]: '#FCE7F3',      // Light Pink
  [CellType.MEETING_ROOM]: '#DBEAFE',   // Light Blue
  [CellType.CAFETERIA]: '#FEF3C7',      // Light Yellow
  [CellType.IT_ROOM]: '#D1FAE5',        // Light Emerald
  [CellType.WASHROOM]: '#F3F4F6',       // Light Gray
  [CellType.OUTER_LOBBY]: '#EDE9FE',    // Light Purple
  [CellType.INNER_LOBBY]: '#F5F3FF',    // Lighter Purple
  [CellType.RECEPTION]: '#FFEDD5',      // Light Orange
  [CellType.TABLE_TENNIS]: '#CCFBF1',   // Light Teal
  [CellType.SERVER_ROOM]: '#CFFAFE',    // Light Cyan
  [CellType.UNKNOWN]: '#FEE2E2',        // Light Red
  [CellType.ENTRANCE]: '#DCFCE7',       // Light Green
};

const nameMap: Record<string, string> = {
  [CellType.NAMED_OFFICE]: 'Named Office',
  [CellType.HR_OFFICE]: 'HR Office',
  [CellType.MEETING_ROOM]: 'Meeting Room',
  [CellType.CAFETERIA]: 'Cafeteria',
  [CellType.IT_ROOM]: 'IT Room',
  [CellType.WASHROOM]: 'Washroom',
  [CellType.OUTER_LOBBY]: 'Outer Lobby',
  [CellType.INNER_LOBBY]: 'Inner Lobby',
  [CellType.RECEPTION]: 'Reception',
  [CellType.TABLE_TENNIS]: 'Table Tennis',
  [CellType.SERVER_ROOM]: 'Server Room',
  [CellType.ENTRANCE]: 'Entrance',
};

const ObjectLayer: React.FC<ObjectLayerProps> = ({ layout }) => {
  const regions: Array<{ type: string; minR: number; maxR: number; minC: number; maxC: number; cells: Array<{r: number, c: number}> }> = [];
  const visited = new Set<string>();

  // 1. Find Connected Components (Regions)
  for (let r = 0; r < layout.rows; r++) {
    for (let c = 0; c < layout.columns; c++) {
      const cellValue = layout.matrix[r][c];
      if (cellValue === CellType.EMPTY || cellValue === CellType.SEAT) continue;
      
      const key = `${r},${c}`;
      if (visited.has(key)) continue;

      const region = { type: cellValue, minR: r, maxR: r, minC: c, maxC: c, cells: [] as Array<{r: number, c: number}> };
      const queue = [{r, c}];
      let head = 0;

      while (head < queue.length) {
        const curr = queue[head++];
        const currKey = `${curr.r},${curr.c}`;
        if (visited.has(currKey)) continue;
        visited.add(currKey);

        region.cells.push(curr);
        region.minR = Math.min(region.minR, curr.r);
        region.maxR = Math.max(region.maxR, curr.r);
        region.minC = Math.min(region.minC, curr.c);
        region.maxC = Math.max(region.maxC, curr.c);

        const neighbors = [
          {r: curr.r - 1, c: curr.c},
          {r: curr.r + 1, c: curr.c},
          {r: curr.r, c: curr.c - 1},
          {r: curr.r, c: curr.c + 1}
        ];

        for (const n of neighbors) {
          if (n.r >= 0 && n.r < layout.rows && n.c >= 0 && n.c < layout.columns) {
            if (layout.matrix[n.r][n.c] === cellValue && !visited.has(`${n.r},${n.c}`)) {
              queue.push(n);
            }
          }
        }
      }
      regions.push(region);
    }
  }

  // 2. Render each region
  return (
    <Layer>
      {regions.map((region, i) => {
        const color = colorMap[region.type] || '#E5E7EB';
        const name = nameMap[region.type] || '';

        const rects = [];
        const borders = [];

        // Calculate center for text
        const cx = (region.minC * CELL_SIZE + (region.maxC + 1) * CELL_SIZE) / 2;
        const cy = (region.minR * CELL_SIZE + (region.maxR + 1) * CELL_SIZE) / 2;

        for (const cell of region.cells) {
          const {r, c} = cell;
          const x = c * CELL_SIZE;
          const y = r * CELL_SIZE;
          const s = CELL_SIZE;

          // Fill rect
          rects.push(
            <Rect
              key={`rect-${i}-${r}-${c}`}
              x={x} y={y} width={s} height={s}
              fill={color} opacity={0.7}
            />
          );

          // Borders (stroke on edges if neighbor is different)
          const borderColor = '#9CA3AF';
          const strokeW = 1.5;

          // Top
          if (r === 0 || layout.matrix[r-1][c] !== region.type) {
            borders.push(<Line key={`bt-${i}-${r}-${c}`} points={[x, y, x+s, y]} stroke={borderColor} strokeWidth={strokeW} />);
          }
          // Bottom
          if (r === layout.rows - 1 || layout.matrix[r+1][c] !== region.type) {
            borders.push(<Line key={`bb-${i}-${r}-${c}`} points={[x, y+s, x+s, y+s]} stroke={borderColor} strokeWidth={strokeW} />);
          }
          // Left
          if (c === 0 || layout.matrix[r][c-1] !== region.type) {
            borders.push(<Line key={`bl-${i}-${r}-${c}`} points={[x, y, x, y+s]} stroke={borderColor} strokeWidth={strokeW} />);
          }
          // Right
          if (c === layout.columns - 1 || layout.matrix[r][c+1] !== region.type) {
            borders.push(<Line key={`br-${i}-${r}-${c}`} points={[x+s, y, x+s, y+s]} stroke={borderColor} strokeWidth={strokeW} />);
          }
        }

        return (
          <Group key={`region-${i}`}>
            {rects}
            {borders}
            {name && (
              <Text 
                x={cx - 100}
                y={cy - 7}
                width={200}
                text={name}
                align="center"
                fontSize={13}
                fontFamily="Inter, sans-serif"
                fontStyle="600"
                fill="#4B5563"
              />
            )}
          </Group>
        );
      })}
    </Layer>
  );
};

export default ObjectLayer;
