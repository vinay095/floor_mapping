import React from 'react';
import { Layer, Rect, Text, Group, Path } from 'react-konva';
import type { Area } from '../../types/area.types';

interface AreaLayerProps {
  areas: Area[];
}

const AreaLayer: React.FC<AreaLayerProps> = ({ areas }) => {
  return (
    <Layer>
      {areas.map(area => {
        const cx = area.x + area.width / 2;
        
        return (
          <Group key={area.id}>
            {/* Background fill */}
            <Rect
              x={area.x}
              y={area.y}
              width={area.width}
              height={area.height}
              fill={`${area.teamColor}33`} // 20% opacity
              cornerRadius={4}
            />
            {/* Border */}
            <Rect
              x={area.x}
              y={area.y}
              width={area.width}
              height={area.height}
              stroke={area.teamColor}
              strokeWidth={3}
              cornerRadius={4}
            />
            
            {/* Icon Group - positioned near top center */}
            <Group x={cx - 12} y={area.y + 16}>
              {/* White circle background for icon */}
              <Rect 
                x={0} y={0} width={24} height={24}
                fill="#ffffff" cornerRadius={12}
                shadowColor="rgba(0,0,0,0.1)" shadowBlur={4} shadowOffset={{ x:0, y:2 }}
              />
              {/* Simple desk/meeting icon inside */}
              <Path
                x={4} y={5}
                data="M2,4 L14,4 L14,6 L2,6 Z M4,6 L4,12 M12,6 L12,12 M1,8 L15,8"
                stroke={area.teamColor}
                strokeWidth={1.5}
                lineCap="round"
                lineJoin="round"
              />
            </Group>

            {/* Room label */}
            <Text
              x={area.x}
              y={area.y + 45}
              width={area.width}
              text={area.name}
              fontSize={14}
              fontFamily="Inter, sans-serif"
              fill={area.teamColor} // Use green text matching border
              fontStyle="500"
              align="center"
            />
          </Group>
        );
      })}
    </Layer>
  );
};

export default AreaLayer;
