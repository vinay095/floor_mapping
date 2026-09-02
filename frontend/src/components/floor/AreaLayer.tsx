import React from 'react';
import { Layer, Rect, Text } from 'react-konva';
import type { Area } from '../../types/area.types';

interface AreaLayerProps {
  areas: Area[];
}

const AreaLayer: React.FC<AreaLayerProps> = ({ areas }) => {
  return (
    <Layer>
      {areas.map(area => (
        <React.Fragment key={area.id}>
          {/* Translucent background */}
          <Rect
            x={area.x}
            y={area.y}
            width={area.width}
            height={area.height}
            fill={area.teamColor}
            opacity={0.08}
            cornerRadius={10}
          />
          {/* Border */}
          <Rect
            x={area.x}
            y={area.y}
            width={area.width}
            height={area.height}
            stroke={area.teamColor}
            strokeWidth={1.5}
            opacity={0.3}
            cornerRadius={10}
            fill="transparent"
          />
          {/* Area label */}
          <Text
            x={area.x + 8}
            y={area.y + 6}
            text={area.name.toUpperCase()}
            fontSize={10}
            fontFamily="Inter, sans-serif"
            fill={area.teamColor}
            fontStyle="600"
            opacity={0.7}
            letterSpacing={1}
          />
        </React.Fragment>
      ))}
    </Layer>
  );
};

export default AreaLayer;
