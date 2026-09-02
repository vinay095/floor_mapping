export interface SeatMetadata {
  seatCode: string;
  /** Which area this seat belongs to (e.g. "area-1") */
  areaId?: string;
}

/** key: "row-col" → metadata */
export type SeatMetadataMap = Record<string, SeatMetadata>;

export interface Seat {
  id: number;
  workspaceId: number;
  areaId?: number;
  seatCode: string;
  row: number;
  col: number;
}

export interface SeatAssignment {
  id: number;
  employeeId: number;
  seatId: number;
  assignedAt: string;
}

/** key: seatCode → employeeId */
export type AssignmentMap = Record<string, number>;
