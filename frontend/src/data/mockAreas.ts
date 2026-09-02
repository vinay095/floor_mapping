import type { Area } from '../types/area.types';
import { CELL_SIZE } from '../constants/layout';

/**
 * Team areas are defined as pixel rectangles over the floor plan.
 * Coordinates are computed from row/col grid positions.
 * These are approximate zones matching the floor6matrix seat clusters.
 */
export const mockAreas: Area[] = [
  {
    id: 'area-top',
    name: 'Product',
    teamId: 2,
    teamColor: '#10B981',
    x: 10 * CELL_SIZE,
    y: 0 * CELL_SIZE,
    width: 14 * CELL_SIZE,
    height: 2 * CELL_SIZE,
  },
  {
    id: 'area-mid-1',
    name: 'Engineering',
    teamId: 1,
    teamColor: '#3B82F6',
    x: 7 * CELL_SIZE,
    y: 3 * CELL_SIZE,
    width: 24 * CELL_SIZE,
    height: 6 * CELL_SIZE,
  },
  {
    id: 'area-mid-2',
    name: 'Design',
    teamId: 3,
    teamColor: '#8B5CF6',
    x: 12 * CELL_SIZE,
    y: 10 * CELL_SIZE,
    width: 19 * CELL_SIZE,
    height: 7 * CELL_SIZE,
  },
  {
    id: 'area-bottom',
    name: 'Data & DevOps',
    teamId: 4,
    teamColor: '#F59E0B',
    x: 0 * CELL_SIZE,
    y: 18 * CELL_SIZE,
    width: 31 * CELL_SIZE,
    height: 6 * CELL_SIZE,
  },
];
