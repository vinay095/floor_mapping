import { CELL_SIZE } from '../constants/layout';
import type { GridPosition, PixelPosition } from '../types/floor.types';

/**
 * Convert a grid position to pixel position (top-left corner of cell).
 */
export function gridToPixel(row: number, col: number): PixelPosition {
  return {
    x: col * CELL_SIZE,
    y: row * CELL_SIZE,
  };
}

/**
 * Convert a pixel position back to the nearest grid position.
 */
export function pixelToGrid(x: number, y: number): GridPosition {
  return {
    row: Math.round(y / CELL_SIZE),
    col: Math.round(x / CELL_SIZE),
  };
}

/**
 * Get the center pixel of a cell.
 */
export function gridToCellCenter(row: number, col: number): PixelPosition {
  return {
    x: col * CELL_SIZE + CELL_SIZE / 2,
    y: row * CELL_SIZE + CELL_SIZE / 2,
  };
}
