import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import Konva from 'konva';
import { CELL_SIZE, STAGE_PADDING, ZOOM_MIN, ZOOM_MAX, ZOOM_STEP } from '../../constants/layout';
import type { MatrixLayout } from '../../types/floor.types';
import type { SeatMetadataMap } from '../../types/seat.types';
import type { Employee } from '../../types/employee.types';
import type { Area } from '../../types/area.types';
import AreaLayer from './AreaLayer';
import ObjectLayer from './ObjectLayer';
import SeatLayer from './SeatLayer';
import TooltipLayer from './TooltipLayer';
import { type TooltipInfo } from '../seat/SeatRenderer';

interface FloorPlanStageProps {
  layout: MatrixLayout;
  seatMetadata: SeatMetadataMap;
  assignedEmployees: Record<string, Employee>;
  areas: Area[];
  containerWidth: number;
  containerHeight: number;
}

const FloorPlanStage: React.FC<FloorPlanStageProps> = ({
  layout,
  seatMetadata,
  assignedEmployees,
  areas,
  containerWidth,
  containerHeight,
}) => {
  const stageRef = useRef<Konva.Stage>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: STAGE_PADDING, y: STAGE_PADDING });
  const [tooltip, setTooltip] = useState<TooltipInfo & { visible: boolean }>({
    visible: false,
    x: 0,
    y: 0,
    employee: undefined as any,
    seatCode: '',
  });

  const floorWidth = layout.columns * CELL_SIZE;
  const floorHeight = layout.rows * CELL_SIZE;

  // Fit floor plan to container on mount
  useEffect(() => {
    if (containerWidth === 0 || containerHeight === 0) return;
    const scaleX = (containerWidth - STAGE_PADDING * 2) / floorWidth;
    const scaleY = (containerHeight - STAGE_PADDING * 2) / floorHeight;
    const fitScale = Math.min(scaleX, scaleY, 1);
    setScale(fitScale);
    setPosition({
      x: (containerWidth - floorWidth * fitScale) / 2,
      y: (containerHeight - floorHeight * fitScale) / 2,
    });
  }, [containerWidth, containerHeight, floorWidth, floorHeight]);

  // Zoom with mouse wheel
  const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const direction = e.evt.deltaY < 0 ? 1 : -1;
    const newScale = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, oldScale + direction * ZOOM_STEP));

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    setScale(newScale);
    setPosition(newPos);
  }, []);

  const handleDragEnd = useCallback((e: Konva.KonvaEventObject<DragEvent>) => {
    setPosition({ x: e.target.x(), y: e.target.y() });
  }, []);

  const handleTooltipShow = useCallback((info: TooltipInfo) => {
    setTooltip({ ...info, visible: true });
  }, []);

  const handleTooltipHide = useCallback(() => {
    setTooltip((prev: any) => ({ ...prev, visible: false }));
  }, []);

  return (
    <Stage
      ref={stageRef}
      width={containerWidth}
      height={containerHeight}
      scaleX={scale}
      scaleY={scale}
      x={position.x}
      y={position.y}
      draggable
      onWheel={handleWheel}
      onDragEnd={handleDragEnd}
      style={{ background: 'transparent' }}
    >
      {/* Floor background */}
      <Layer>
        <Rect
          x={0}
          y={0}
          width={floorWidth}
          height={floorHeight}
          fill="transparent"
          cornerRadius={8}
        />
        {/* Grid lines - subtle */}
        {Array.from({ length: layout.rows + 1 }).map((_, i) => (
          <Rect
            key={`hline-${i}`}
            x={0}
            y={i * CELL_SIZE}
            width={floorWidth}
            height={1}
            fill="#F3F4F6"
          />
        ))}
        {Array.from({ length: layout.columns + 1 }).map((_, i) => (
          <Rect
            key={`vline-${i}`}
            x={i * CELL_SIZE}
            y={0}
            width={1}
            height={floorHeight}
            fill="#F3F4F6"
          />
        ))}
      </Layer>

      {/* Team area backgrounds */}
      <AreaLayer areas={areas} />

      {/* Static objects (rooms, washrooms, etc) */}
      <ObjectLayer layout={layout} />

      {/* Seats */}
      <SeatLayer
        layout={layout}
        seatMetadata={seatMetadata}
        assignedEmployees={assignedEmployees}
        onTooltipShow={handleTooltipShow}
        onTooltipHide={handleTooltipHide}
      />

      {/* Hover tooltip — non-interactive, always on top */}
      <TooltipLayer
        visible={tooltip.visible}
        x={tooltip.x / scale - position.x / scale}
        y={tooltip.y / scale - position.y / scale}
        employee={tooltip.employee}
        seatCode={tooltip.seatCode}
        stageWidth={containerWidth / scale}
        stageHeight={containerHeight / scale}
      />
    </Stage>
  );
};

export default FloorPlanStage;
