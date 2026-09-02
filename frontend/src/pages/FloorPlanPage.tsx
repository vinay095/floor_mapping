import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import FloorPlanStage from '../components/floor/FloorPlanStage';
import Toolbar from '../components/ui/Toolbar';
import Legend from '../components/ui/Legend';
import matrixData from '../assets/floor6matrix.json';
import { mockEmployees } from '../data/mockEmployees';
import { mockTeams } from '../data/mockTeams';
import { mockAssignments } from '../data/mockAssignments';
import { mockAreas } from '../data/mockAreas';
import { generateReadableSeatMetadata } from '../utils/seatUtils';
import { extractSeatPositions } from '../utils/matrixUtils';
import type { Employee } from '../types/employee.types';
import type { MatrixLayout } from '../types/floor.types';
import { CELL_SIZE, STAGE_PADDING, ZOOM_MIN, ZOOM_MAX, ZOOM_STEP } from '../constants/layout';

const layout = matrixData as MatrixLayout;

const FloorPlanPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);

  // Measure container
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Compute seat metadata (row-col → { seatCode })
  const seatMetadata = useMemo(() => generateReadableSeatMetadata(layout), []);

  // Build seatCode → Employee map from assignments
  const assignedEmployees = useMemo<Record<string, Employee>>(() => {
    const employeeById = Object.fromEntries(mockEmployees.map(e => [e.id, e]));
    const result: Record<string, Employee> = {};
    for (const [seatCode, employeeId] of Object.entries(mockAssignments)) {
      if (employeeById[employeeId]) {
        result[seatCode] = employeeById[employeeId];
      }
    }
    return result;
  }, []);

  // Stats
  const totalSeats = useMemo(() => extractSeatPositions(layout).length, []);
  const occupiedSeats = Object.keys(assignedEmployees).length;

  // Zoom controls — communicate down to stage via callback refs
  const stageZoomRef = useRef<{
    zoomIn: () => void;
    zoomOut: () => void;
    reset: () => void;
  } | null>(null);

  const floorWidth = layout.columns * CELL_SIZE;
  const floorHeight = layout.rows * CELL_SIZE;

  const computeFitScale = useCallback(() => {
    if (dimensions.width === 0) return 1;
    const sx = (dimensions.width - STAGE_PADDING * 2) / floorWidth;
    const sy = (dimensions.height - STAGE_PADDING * 2) / floorHeight;
    return Math.min(sx, sy, 1);
  }, [dimensions, floorWidth, floorHeight]);

  // We'll pass zoom state up from FloorPlanStage via prop drilling
  // For now use local zoom state synced via callback
  const handleZoomChange = useCallback((z: number) => setZoom(z), []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#060D1A', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: 56,
        borderBottom: '1px solid #1E293B',
        background: 'rgba(9, 18, 35, 0.95)',
        backdropFilter: 'blur(10px)',
        flexShrink: 0,
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Logo mark */}
          <div style={{
            width: 32, height: 32,
            background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
          }}>🏢</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#F1F5F9', letterSpacing: '-0.02em' }}>
              Office Floor Map
            </div>
            <div style={{ fontSize: 11, color: '#475569' }}>Floor 6 · Live View</div>
          </div>
        </div>

        {/* Stats pills */}
        <div style={{ display: 'flex', gap: 8 }}>
          <Pill label="Seats" value={totalSeats} color="#3B82F6" />
          <Pill label="Occupied" value={occupiedSeats} color="#10B981" />
          <Pill label="Free" value={totalSeats - occupiedSeats} color="#F59E0B" />
        </div>

        {/* Admin badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '4px 12px',
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: 20,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: '#3B82F6', boxShadow: '0 0 6px #3B82F6' }} />
          <span style={{ fontSize: 12, color: '#93C5FD', fontWeight: 500 }}>Admin</span>
        </div>
      </header>

      {/* Main area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* Canvas container */}
        <div
          ref={containerRef}
          style={{ flex: 1, position: 'relative', overflow: 'hidden' }}
        >
          {dimensions.width > 0 && (
            <FloorPlanStage
              layout={layout}
              seatMetadata={seatMetadata}
              assignedEmployees={assignedEmployees}
              areas={mockAreas}
              containerWidth={dimensions.width}
              containerHeight={dimensions.height}
            />
          )}

          {/* Floating toolbar */}
          <div style={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 5,
          }}>
            <Toolbar
              currentZoom={zoom}
              onZoomIn={() => setZoom(z => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)))}
              onZoomOut={() => setZoom(z => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)))}
              onReset={() => setZoom(computeFitScale())}
            />
          </div>

          {/* Help hint */}
          <div style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            fontSize: 11,
            color: '#334155',
            textAlign: 'right',
            lineHeight: 1.8,
          }}>
            <div>🖱 Scroll to zoom</div>
            <div>✋ Drag to pan</div>
            <div>👆 Hover seat for details</div>
          </div>
        </div>

        {/* Right panel: legend */}
        <div style={{
          width: 200,
          padding: 16,
          borderLeft: '1px solid #1E293B',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          overflowY: 'auto',
          background: 'rgba(9, 18, 35, 0.7)',
        }}>
          <Legend
            teams={mockTeams}
            totalSeats={totalSeats}
            occupiedSeats={occupiedSeats}
          />

          {/* Employee list */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid #1E293B',
            borderRadius: 10,
            padding: '12px',
            flex: 1,
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
              Employees
            </div>
            {mockEmployees.map(emp => (
              <EmployeeRow key={emp.id} employee={emp} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Pill: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '3px 10px',
    background: `${color}15`,
    border: `1px solid ${color}40`,
    borderRadius: 20,
  }}>
    <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}</span>
    <span style={{ fontSize: 11, color: '#64748B' }}>{label}</span>
  </div>
);

const EmployeeRow: React.FC<{ employee: Employee }> = ({ employee }) => {
  const teamColors: Record<string, string> = {
    Engineering: '#3B82F6',
    Product: '#10B981',
    Design: '#8B5CF6',
    'Data & Analytics': '#F59E0B',
    DevOps: '#EF4444',
    QA: '#06B6D4',
  };
  const color = teamColors[employee.teamName] ?? '#94A3B8';
  const initials = employee.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '6px 0',
      borderBottom: '1px solid #0F172A',
    }}>
      <div style={{
        width: 26,
        height: 26,
        borderRadius: 13,
        background: `hsl(${(employee.id * 47) % 360}, 70%, 45%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 10,
        fontWeight: 700,
        color: '#fff',
        flexShrink: 0,
      }}>
        {initials}
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#CBD5E1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {employee.name}
        </div>
        <div style={{ fontSize: 10, color: color, fontWeight: 500 }}>
          {employee.teamName}
        </div>
      </div>
    </div>
  );
};

export default FloorPlanPage;
