export interface Area {
  id: string;
  name: string;
  teamId?: number;
  teamColor: string;
  /** Top-left pixel x (derived from col * CELL_SIZE) */
  x: number;
  /** Top-left pixel y (derived from row * CELL_SIZE) */
  y: number;
  width: number;
  height: number;
}
