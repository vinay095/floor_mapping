import type { Area } from '../types/area.types';
import { CELL_SIZE } from '../constants/layout';

/**
 * Team areas mapped to resemble the meeting rooms in the mockup.
 */
export const mockAreas: Area[] = [
  {
    id: 'room-1',
    name: 'Valley',
    teamColor: '#22C55E', // Green
    x: 4 * CELL_SIZE,
    y: 0 * CELL_SIZE,
    width: 3 * CELL_SIZE,
    height: 3 * CELL_SIZE,
  },
  {
    id: 'room-2',
    name: 'Sky',
    teamColor: '#22C55E',
    x: 8 * CELL_SIZE,
    y: 0 * CELL_SIZE,
    width: 3 * CELL_SIZE,
    height: 3 * CELL_SIZE,
  },
  {
    id: 'room-3',
    name: 'Beach',
    teamColor: '#22C55E',
    x: 12 * CELL_SIZE,
    y: 0 * CELL_SIZE,
    width: 3 * CELL_SIZE,
    height: 3 * CELL_SIZE,
  },
  {
    id: 'room-4',
    name: 'Mountain',
    teamColor: '#22C55E',
    x: 3 * CELL_SIZE,
    y: 19 * CELL_SIZE,
    width: 4 * CELL_SIZE,
    height: 5 * CELL_SIZE,
  },
  {
    id: 'room-5',
    name: 'Forest',
    teamColor: '#22C55E',
    x: 8 * CELL_SIZE,
    y: 19 * CELL_SIZE,
    width: 3 * CELL_SIZE,
    height: 5 * CELL_SIZE,
  },
  {
    id: 'room-6',
    name: 'Beach',
    teamColor: '#22C55E',
    x: 12 * CELL_SIZE,
    y: 19 * CELL_SIZE,
    width: 3 * CELL_SIZE,
    height: 5 * CELL_SIZE,
  },
  {
    id: 'room-7',
    name: 'Island',
    teamColor: '#22C55E',
    x: 16 * CELL_SIZE,
    y: 19 * CELL_SIZE,
    width: 3 * CELL_SIZE,
    height: 5 * CELL_SIZE,
  },
];
