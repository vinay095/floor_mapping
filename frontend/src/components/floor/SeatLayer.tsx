import React from 'react';
import { Layer } from 'react-konva';
import SeatRenderer, { type TooltipInfo } from '../seat/SeatRenderer';
import type { MatrixLayout } from '../../types/floor.types';
import type { SeatMetadataMap } from '../../types/seat.types';
import type { Employee } from '../../types/employee.types';
import { CellType } from '../../constants/cellTypes';
import { seatKey } from '../../utils/seatUtils';

interface SeatLayerProps {
  layout: MatrixLayout;
  seatMetadata: SeatMetadataMap;
  /** seatCode → Employee mapping */
  assignedEmployees: Record<string, Employee>;
  onTooltipShow: (info: TooltipInfo) => void;
  onTooltipHide: () => void;
}

const SeatLayer: React.FC<SeatLayerProps> = ({
  layout,
  seatMetadata,
  assignedEmployees,
  onTooltipShow,
  onTooltipHide,
}) => {
  const seats: React.ReactNode[] = [];

  for (let row = 0; row < layout.rows; row++) {
    for (let col = 0; col < layout.columns; col++) {
      if (layout.matrix[row][col] === CellType.SEAT) {
        const key = seatKey(row, col);
        const meta = seatMetadata[key];
        if (!meta) continue;

        const employee = assignedEmployees[meta.seatCode];

        seats.push(
          <SeatRenderer
            key={key}
            row={row}
            col={col}
            metadata={meta}
            employee={employee}
            onTooltipShow={onTooltipShow}
            onTooltipHide={onTooltipHide}
          />
        );
      }
    }
  }

  return <Layer>{seats}</Layer>;
};

export default SeatLayer;
