import { CellType } from '../constants/cellTypes';
import type { GridPosition, MatrixLayout } from '../types/floor.types';

/**
 * Extract all seat positions (value === CellType.SEAT) from the matrix.
 * Returns an array of { row, col } objects.
 */
export function extractSeatPositions(layout: MatrixLayout): GridPosition[] {
  const positions: GridPosition[] = [];
  for (let row = 0; row < layout.rows; row++) {
    for (let col = 0; col < layout.columns; col++) {
      if (layout.matrix[row][col] === CellType.SEAT) {
        positions.push({ row, col });
      }
    }
  }
  return positions;
}

/**
 * Get the cell type at a given position.
 */
export function getCellType(layout: MatrixLayout, row: number, col: number): CellType {
  if (row < 0 || row >= layout.rows || col < 0 || col >= layout.columns) {
    return CellType.EMPTY;
  }
  return layout.matrix[row][col] as CellType;
}

/**
 * Check if a cell is a seat.
 */
export function isSeat(layout: MatrixLayout, row: number, col: number): boolean {
  return getCellType(layout, row, col) === CellType.SEAT;
}
