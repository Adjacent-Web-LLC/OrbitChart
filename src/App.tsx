import { useState } from 'react';
import RadialOrbit from './components/RadialOrbit';
import { demoOrbitData } from './data/demo-orbit-data';
import type { RadialOrbitGroup, RadialOrbitItem, ItemRendererProps } from './types/radial-orbit';

function App() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedDial, setSelectedDial] = useState<number | null>(null);
  
  // Control states
  const [chartSize, setChartSize] = useState({ width: 800, height: 800 });
  const [animation, setAnimation] = useState({
    orbitRotation: true,
    orbitSpeedBase: 80,
    hoverScale: 1.15,
  });
  const [visibleGroups, setVisibleGroups] = useState<Record<string, boolean>>({
    finance: true,
    'company-stack': true,
    'shadow-it': true,
  });

  const handleGroupSelect = (group: RadialOrbitGroup) => {
    setSelectedGroup(group.id);
    console.log('Group selected:', group);
  };

  const handleItemSelect = (item: RadialOrbitItem, group: RadialOrbitGroup) => {
    setSelectedItem(item.id);
    console.log('Item selected:', item, 'from group:', group.label);
  };

  const handleDialSelect = (index: number) => {
    setSelectedDial(index);
    console.log('Dial selected:', index);
  };

  // React component for custom item rendering
  const CustomItemCard = ({ item, isHovered, radius, scale }: { item: RadialOrbitItem; isHovered: boolean; radius: number; scale: number }) => {
    const size = radius * scale * 2;
    
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '12px',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          boxShadow: isHovered 
            ? '0 8px 16px rgba(0, 0, 0, 0.4), 0 0 20px rgba(96, 165, 250, 0.5)' 
            : '0 4px 8px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px',
          transition: 'all 0.3s ease',
          opacity: isHovered ? 1 : 0.85,
          cursor: 'pointer',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            fontSize: Math.max(8, size * 0.12),
            fontWeight: 600,
            color: 'white',
            textAlign: 'center',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
            lineHeight: 1.2,
          }}
        >
          {item.label}
        </div>
        <div
          style={{
            fontSize: Math.max(6, size * 0.1),
            color: 'rgba(255, 255, 255, 0.8)',
            marginTop: '2px',
          }}
        >
          {item.value}
        </div>
      </div>
    );
  };

  // Custom renderer that uses foreignObject to render React component
  const customItemRenderer = (props: ItemRendererProps) => {
    const { item, position, radius, scale, onMouseEnter, onMouseLeave, onClick, isHovered } = props;
    const size = radius * scale * 2;
    const halfSize = size / 2;

    return (
      <foreignObject
        x={position.x - halfSize}
        y={position.y - halfSize}
        width={size}
        height={size}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CustomItemCard item={item} isHovered={isHovered} radius={radius} scale={scale} />
        </div>
      </foreignObject>
    );
  };

  // Filter groups based on visibility
  const filteredData = {
    ...demoOrbitData,
    groups: demoOrbitData.groups.filter(group => visibleGroups[group.id] !== false),
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        background: 'linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a)',
        position: 'relative',
        display: 'flex',
        paddingLeft: '280px',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {/* Fixed Left Sidebar */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '280px',
          height: '100vh',
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          borderRight: '1px solid rgba(51, 65, 85, 1)',
          padding: '20px',
          overflowY: 'auto',
          zIndex: 1000,
          backdropFilter: 'blur(10px)',
        }}
      >
        <h2
          style={{
            color: 'white',
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '24px',
            marginTop: 0,
          }}
        >
          Chart Controls
        </h2>

        {/* Size Controls */}
        <div style={{ marginBottom: '32px' }}>
          <h3
            style={{
              color: '#94a3b8',
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Size
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  color: '#cbd5e1',
                  fontSize: '12px',
                  marginBottom: '6px',
                }}
              >
                Width: {chartSize.width}px
              </label>
              <input
                type="range"
                min="400"
                max="1200"
                step="50"
                value={chartSize.width}
                onChange={(e) =>
                  setChartSize({ ...chartSize, width: parseInt(e.target.value) })
                }
                style={{
                  width: '100%',
                  accentColor: '#60a5fa',
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  color: '#cbd5e1',
                  fontSize: '12px',
                  marginBottom: '6px',
                }}
              >
                Height: {chartSize.height}px
              </label>
              <input
                type="range"
                min="400"
                max="1200"
                step="50"
                value={chartSize.height}
                onChange={(e) =>
                  setChartSize({ ...chartSize, height: parseInt(e.target.value) })
                }
                style={{
                  width: '100%',
                  accentColor: '#60a5fa',
                }}
              />
            </div>
          </div>
        </div>

        {/* Animation Controls */}
        <div style={{ marginBottom: '32px' }}>
          <h3
            style={{
              color: '#94a3b8',
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Animation
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#cbd5e1',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={animation.orbitRotation}
                onChange={(e) =>
                  setAnimation({ ...animation, orbitRotation: e.target.checked })
                }
                style={{ accentColor: '#60a5fa' }}
              />
              Orbit Rotation
            </label>
            <div>
              <label
                style={{
                  display: 'block',
                  color: '#cbd5e1',
                  fontSize: '12px',
                  marginBottom: '6px',
                }}
              >
                Speed: {animation.orbitSpeedBase}s
              </label>
              <input
                type="range"
                min="20"
                max="200"
                step="10"
                value={animation.orbitSpeedBase}
                onChange={(e) =>
                  setAnimation({
                    ...animation,
                    orbitSpeedBase: parseInt(e.target.value),
                  })
                }
                style={{
                  width: '100%',
                  accentColor: '#60a5fa',
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  color: '#cbd5e1',
                  fontSize: '12px',
                  marginBottom: '6px',
                }}
              >
                Hover Scale: {animation.hoverScale}x
              </label>
              <input
                type="range"
                min="1"
                max="2"
                step="0.05"
                value={animation.hoverScale}
                onChange={(e) =>
                  setAnimation({
                    ...animation,
                    hoverScale: parseFloat(e.target.value),
                  })
                }
                style={{
                  width: '100%',
                  accentColor: '#60a5fa',
                }}
              />
            </div>
          </div>
        </div>

        {/* Group Controls */}
        <div style={{ marginBottom: '32px' }}>
          <h3
            style={{
              color: '#94a3b8',
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Groups
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {demoOrbitData.groups.map((group) => (
              <label
                key={group.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#cbd5e1',
                  fontSize: '12px',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '6px',
                  backgroundColor: visibleGroups[group.id]
                    ? 'rgba(96, 165, 250, 0.1)'
                    : 'transparent',
                  transition: 'background-color 0.2s',
                }}
              >
                <input
                  type="checkbox"
                  checked={visibleGroups[group.id] !== false}
                  onChange={(e) =>
                    setVisibleGroups({
                      ...visibleGroups,
                      [group.id]: e.target.checked,
                    })
                  }
                  style={{ accentColor: '#60a5fa' }}
                />
                {group.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '40px 20px 80px 20px',
          gap: '60px',
          width: '100%',
        }}
      >
        {/* First Demo - Default */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            minHeight: chartSize.height + 40,
          }}
        >
          <RadialOrbit
            data={filteredData}
            width={chartSize.width}
            height={chartSize.height}
            sortableBy="value"
            onGroupSelect={handleGroupSelect}
            onItemSelect={handleItemSelect}
            onDialSelect={handleDialSelect}
            animation={animation}
            colors={{
              background: 'transparent',
              ring: 'rgba(100, 116, 139, 0.3)',
              center: '#1e293b',
              tooltip: 'rgba(15, 23, 42, 0.95)',
            }}
          />
        </div>

        {/* Second Demo - Custom Renderer */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            overflow: 'hidden',
            minHeight: chartSize.height + 40,
          }}
        >
          <div
            style={{
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
            }}
          >
            Custom Renderer
          </div>
          <RadialOrbit
            data={filteredData}
            width={chartSize.width}
            height={chartSize.height}
            sortableBy="value"
            onGroupSelect={handleGroupSelect}
            onItemSelect={handleItemSelect}
            onDialSelect={handleDialSelect}
            renderItem={customItemRenderer}
            animation={animation}
            colors={{
              background: 'transparent',
              ring: 'rgba(100, 116, 139, 0.3)',
              center: '#1e293b',
              tooltip: 'rgba(15, 23, 42, 0.95)',
            }}
          />
        </div>
      </div>

      {(selectedGroup || selectedItem || selectedDial !== null) && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '24px',
            fontSize: '14px',
            zIndex: 1001,
          }}
        >
          {selectedGroup && (
            <div
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(51, 65, 85, 1)',
                backdropFilter: 'blur(4px)',
              }}
            >
              <span style={{ color: '#94a3b8' }}>Selected Group:</span>{' '}
              <span style={{ color: 'white', fontWeight: 600 }}>{selectedGroup}</span>
            </div>
          )}
          {selectedItem && (
            <div
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(51, 65, 85, 1)',
                backdropFilter: 'blur(4px)',
              }}
            >
              <span style={{ color: '#94a3b8' }}>Selected Item:</span>{' '}
              <span style={{ color: 'white', fontWeight: 600 }}>{selectedItem}</span>
            </div>
          )}
          {selectedDial !== null && (
            <div
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(51, 65, 85, 1)',
                backdropFilter: 'blur(4px)',
              }}
            >
              <span style={{ color: '#94a3b8' }}>Selected Dial:</span>{' '}
              <span style={{ color: 'white', fontWeight: 600 }}>{selectedDial}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
