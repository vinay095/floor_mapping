import { CellType } from '../constants/cellTypes';

export interface MatrixLayout {
  rows: number;
  columns: number;
  matrix: number[][];
}

export interface GridPosition {
  row: number;
  col: number;
}

export interface PixelPosition {
  x: number;
  y: number;
}

export type CellValue = CellType;
