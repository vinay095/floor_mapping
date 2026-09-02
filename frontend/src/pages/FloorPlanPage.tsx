import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { SearchOutlined, FilterOutlined, DownOutlined, EditOutlined, SettingOutlined, PlusOutlined, MinusOutlined, UserOutlined, TeamOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import FloorPlanStage from '../components/floor/FloorPlanStage';
import Toolbar from '../components/ui/Toolbar';
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
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
  }, [sidebarOpen]);

  // Compute seat metadata
  const seatMetadata = useMemo(() => generateReadableSeatMetadata(layout), []);

  // Build assignments
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

  const floorWidth = layout.columns * CELL_SIZE;
  const floorHeight = layout.rows * CELL_SIZE;

  const computeFitScale = useCallback(() => {
    if (dimensions.width === 0) return 1;
    const sx = (dimensions.width - STAGE_PADDING * 2) / floorWidth;
    const sy = (dimensions.height - STAGE_PADDING * 2) / floorHeight;
    return Math.min(sx, sy, 1);
  }, [dimensions, floorWidth, floorHeight]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--color-bg-deep)' }}>
      {/* Top Navbar */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', height: 48, background: 'var(--color-nav-bg)', color: '#fff',
        flexShrink: 0, zIndex: 10
      }}>
        <div style={{ fontSize: 16, fontWeight: 500 }}>New draft</div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button style={{ background: '#fff', color: '#373A40', border: 'none', padding: '6px 16px', borderRadius: 4, fontWeight: 500, cursor: 'pointer' }}>
            Save draft
          </button>
          <button style={{ background: '#F87171', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: 4, fontWeight: 500, cursor: 'pointer' }}>
            Publish
          </button>
          <button style={{ background: '#fff', color: '#373A40', border: 'none', width: 28, height: 28, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <CloseOutlined style={{ fontSize: 14 }} />
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Left Narrow Nav Sidebar */}
        <div style={{
          width: 72, background: 'var(--color-bg-surface)', borderRight: '1px solid var(--color-border)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 16, gap: 24, zIndex: 5
        }}>
          <NavIcon icon={<MenuOutlined />} label="Map overview" />
          <NavIcon icon={<TeamOutlined />} label="Manage seating" active />
          <NavIcon icon={<PlusOutlined />} label="Add resources" />
        </div>

        {/* Secondary Seating Sidebar */}
        {sidebarOpen && (
          <div style={{
            width: 320, background: 'var(--color-bg-surface)', borderRight: '1px solid var(--color-border)',
            display: 'flex', flexDirection: 'column', zIndex: 4
          }}>
            <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: 15 }}>Seating</span>
              <CloseOutlined style={{ cursor: 'pointer', color: 'var(--color-text-muted)' }} onClick={() => setSidebarOpen(false)} />
            </div>
            
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Search */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
                border: '1px solid var(--color-border)', borderRadius: 20, background: '#F9FAFB'
              }}>
                <SearchOutlined style={{ color: 'var(--color-text-muted)' }} />
                <input 
                  type="text" placeholder="Search employees" 
                  style={{ border: 'none', background: 'transparent', outline: 'none', flex: 1, fontSize: 13 }} 
                />
              </div>

              {/* Insights Filter */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 6, background: '#4F46E5', color: '#fff',
                  border: 'none', padding: '6px 12px', borderRadius: 4, fontSize: 12, fontWeight: 500, cursor: 'pointer'
                }}>
                  ✨ Insights (5)
                </button>
                <FilterOutlined style={{ color: 'var(--color-text-secondary)', cursor: 'pointer' }} />
              </div>
            </div>

            {/* Accordion Lists (Mock) */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
              <SidebarAccordion title="Unassigned" count={3} defaultOpen>
                <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: 6, fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 12, display: 'flex', gap: 8 }}>
                   <div style={{color: '#4F46E5'}}>✨</div>
                   3 employees come in above the required attendance in the last 90 days.
                </div>
                <TeamGroup name="Marketing" employees={mockEmployees.slice(0, 2)} />
                <TeamGroup name="Sales" employees={mockEmployees.slice(2, 3)} />
              </SidebarAccordion>
              
              <SidebarAccordion title="Assigned" count={12}>
                 <TeamGroup name="Engineering" employees={mockEmployees.slice(3, 8)} />
              </SidebarAccordion>
            </div>
          </div>
        )}

        {/* Main Canvas Area */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-deep)' }}>
          
          {/* Top Overlays */}
          <div style={{ position: 'absolute', top: 20, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', zIndex: 2 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {!sidebarOpen && (
                <button onClick={() => setSidebarOpen(true)} style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: 4, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MenuOutlined /> Seating
                </button>
              )}
              <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: 4, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                Floor 4 <DownOutlined style={{ fontSize: 10, color: 'var(--color-text-muted)' }} />
              </div>
              <button style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: 4, width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <EditOutlined style={{ color: 'var(--color-text-secondary)' }} />
              </button>
            </div>
            
            <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: 4, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
              Neighborhood <DownOutlined style={{ fontSize: 10, color: 'var(--color-text-muted)' }} />
            </div>
          </div>

          {/* Konva Canvas */}
          <div ref={containerRef} style={{ flex: 1, overflow: 'hidden' }}>
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
          </div>

          {/* Bottom Overlays */}
          <div style={{ position: 'absolute', bottom: 20, right: 20, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 2 }}>
            <Toolbar
              currentZoom={zoom}
              onZoomIn={() => setZoom(z => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)))}
              onZoomOut={() => setZoom(z => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)))}
              onReset={() => setZoom(computeFitScale())}
            />
          </div>

          <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 12, zIndex: 2 }}>
             <BottomBtn text="Deactivate everything on this floor" />
             <BottomBtn text="Activate everything on this floor" />
             <BottomBtn text="Delete everything on this floor" />
          </div>

        </div>
      </div>
    </div>
  );
};

// Sub-components for Sidebar
const NavIcon = ({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', color: active ? 'var(--color-accent-red)' : 'var(--color-text-secondary)' }}>
    <div style={{ fontSize: 18 }}>{icon}</div>
    <div style={{ fontSize: 10, textAlign: 'center', maxWidth: 60, lineHeight: 1.2 }}>{label}</div>
  </div>
);

const SidebarAccordion = ({ title, count, defaultOpen = false, children }: any) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: 16 }}>
      <div onClick={() => setOpen(!open)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', cursor: 'pointer', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 13, color: 'var(--color-text-primary)' }}>
          <DownOutlined style={{ fontSize: 10, transform: open ? 'none' : 'rotate(-90deg)', transition: 'transform 0.2s' }} />
          {title}
        </div>
        <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{count}</span>
      </div>
      {open && <div style={{ paddingTop: 12 }}>{children}</div>}
    </div>
  );
};

const TeamGroup = ({ name, employees }: { name: string; employees: Employee[] }) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
       <DownOutlined style={{ fontSize: 8 }} /> {name}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {employees.map(e => (
        <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0 4px 14px', fontSize: 12 }}>
          <span>{e.name}</span>
          <span style={{ color: 'var(--color-text-muted)' }}>(1x)</span>
        </div>
      ))}
    </div>
  </div>
);

const BottomBtn = ({ text }: { text: string }) => (
  <button style={{ background: '#fff', border: '1px solid var(--color-border)', padding: '8px 16px', borderRadius: 4, fontSize: 12, color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
    {text}
  </button>
);

export default FloorPlanPage;
