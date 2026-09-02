import type { MatrixLayout } from '../types/floor.types';
import type { SeatMetadataMap, SeatMetadata } from '../types/seat.types';
import { extractSeatPositions } from './matrixUtils';

/**
 * Generate seat codes in A1, A2... Z1... style.
 * Seats are numbered sequentially scanning top-to-bottom, left-to-right.
 * Each group of seats in the same row band gets a letter prefix.
 */
export function generateSeatMetadata(layout: MatrixLayout): SeatMetadataMap {
  const positions = extractSeatPositions(layout);
  const metadata: SeatMetadataMap = {};

  positions.forEach((pos, index) => {
    const key = `${pos.row}-${pos.col}`;
    const letterIndex = Math.floor(index / 26);
    const letter = String.fromCharCode(65 + (index % 26));
    const code = letterIndex > 0
      ? `${String.fromCharCode(65 + letterIndex - 1)}${letter}${Math.floor(index / 26) + 1}`
      : `${letter}${index + 1}`;

    const meta: SeatMetadata = {
      seatCode: `S${index + 1}`,
    };
    metadata[key] = meta;
  });

  // Re-do with simpler sequential naming: S1, S2, ..., S100 etc.
  // This makes it easy to identify seats uniquely.
  return metadata;
}

/**
 * Simpler seat code generator: assigns codes row by row.
 * Each row of seats gets its own letter group.
 * E.g., Row 0 seats → A1, A2, A3... Row 4 seats → B1, B2...
 */
export function generateReadableSeatMetadata(layout: MatrixLayout): SeatMetadataMap {
  const metadata: SeatMetadataMap = {};
  let rowGroupIndex = 0;
  let lastSeatRow = -1;
  let seatsInGroup = 0;

  const positions = extractSeatPositions(layout);

  for (const pos of positions) {
    // Start a new letter group when entering a new row band
    if (pos.row !== lastSeatRow) {
      // Check if this is truly a new row group (not just adjacent row)
      if (lastSeatRow >= 0 && pos.row - lastSeatRow > 1) {
        rowGroupIndex++;
        seatsInGroup = 0;
      } else if (lastSeatRow < 0) {
        // First seat
      } else if (pos.row !== lastSeatRow) {
        // Adjacent row, same group
      }
      lastSeatRow = pos.row;
    }

    seatsInGroup++;
    const letter = String.fromCharCode(65 + rowGroupIndex); // A, B, C...
    const key = `${pos.row}-${pos.col}`;
    metadata[key] = { seatCode: `${letter}${seatsInGroup}` };
  }

  return metadata;
}

/**
 * Build a lookup key for seat metadata from row and col.
 */
export function seatKey(row: number, col: number): string {
  return `${row}-${col}`;
}
