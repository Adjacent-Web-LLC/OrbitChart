import React from 'react';
import type { ItemShape, RadialOrbitData } from '../types/radial-orbit';

interface ChartControlsSidebarProps {
  selectedDataSet: string;
  setSelectedDataSet: (value: string) => void;
  demoDataSets: Record<string, { label: string; data: RadialOrbitData }>;
  chartSize: { width: number; height: number };
  setChartSize: (size: { width: number; height: number }) => void;
  animation: {
    orbitRotation: boolean;
    orbitSpeedBase: number;
    hoverScale: number;
    orbits?: string[];
    dataLoadedAnimation?: 'sides' | 'center' | 'none';
  };
  setAnimation: (animation: ChartControlsSidebarProps['animation']) => void;
  visibleGroups: Record<string, boolean>;
  setVisibleGroups: (groups: Record<string, boolean>) => void;
  currentData: RadialOrbitData;
  groupBy: boolean;
  setGroupBy: (value: boolean) => void;
  groupOrbits: string[][] | undefined;
  setGroupOrbits: (orbits: string[][] | undefined) => void;
  orbitPaths: {
    show: boolean;
    strokeWidth: number;
    strokeDasharray: string;
    opacity: number;
    hoverStrokeWidth: number;
    hoverOpacity: number;
  };
  setOrbitPaths: (paths: ChartControlsSidebarProps['orbitPaths']) => void;
  itemShape: ItemShape;
  setItemShape: (shape: ItemShape) => void;
}

const ChartControlsSidebar: React.FC<ChartControlsSidebarProps> = ({
  selectedDataSet,
  setSelectedDataSet,
  demoDataSets,
  chartSize,
  setChartSize,
  animation,
  setAnimation,
  visibleGroups,
  setVisibleGroups,
  currentData,
  groupBy,
  setGroupBy,
  groupOrbits,
  setGroupOrbits,
  orbitPaths,
  setOrbitPaths,
  itemShape,
  setItemShape,
}) => {
  return (
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

      {/* Demo Data Selector */}
      <div style={{ marginBottom: '32px' }}>
        <label
          style={{
            display: 'block',
            color: '#94a3b8',
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Demo Data
        </label>
          <select
            value={selectedDataSet}
            onChange={(e) => {
              setSelectedDataSet(e.target.value);
              setGroupOrbits(undefined);
            }}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '6px',
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(51, 65, 85, 1)',
            color: '#cbd5e1',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          {Object.entries(demoDataSets).map(([key, { label }]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

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
          {animation.orbitRotation && (
            <div>
              <label
                style={{
                  display: 'block',
                  color: '#cbd5e1',
                  fontSize: '12px',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Animate Orbits
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {currentData.groups.map((group) => (
                  <label
                    key={group.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#cbd5e1',
                      fontSize: '11px',
                      cursor: 'pointer',
                      padding: '4px 6px',
                      borderRadius: '4px',
                      backgroundColor: (animation.orbits === undefined || (animation.orbits && animation.orbits.includes(group.id)))
                        ? 'rgba(96, 165, 250, 0.2)'
                        : 'transparent',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={animation.orbits === undefined || (animation.orbits && animation.orbits.includes(group.id))}
                      onChange={(e) => {
                        if (animation.orbits === undefined) {
                          // If undefined, initialize with all groups except this one (if unchecking) or all groups (if checking)
                          const allGroupIds = currentData.groups.map(g => g.id);
                          if (e.target.checked) {
                            setAnimation({
                              ...animation,
                              orbits: allGroupIds,
                            });
                          } else {
                            setAnimation({
                              ...animation,
                              orbits: allGroupIds.filter(id => id !== group.id),
                            });
                          }
                        } else {
                          const currentOrbits = animation.orbits;
                          if (e.target.checked) {
                            setAnimation({
                              ...animation,
                              orbits: [...currentOrbits, group.id],
                            });
                          } else {
                            const newOrbits = currentOrbits.filter(id => id !== group.id);
                            setAnimation({
                              ...animation,
                              orbits: newOrbits.length === 0 ? undefined : newOrbits,
                            });
                          }
                        }
                      }}
                      style={{ accentColor: '#60a5fa' }}
                    />
                    {group.label}
                  </label>
                ))}
                {animation.orbits !== undefined && (
                  <button
                    onClick={() => setAnimation({ ...animation, orbits: undefined })}
                    style={{
                      marginTop: '4px',
                      padding: '4px 8px',
                      fontSize: '10px',
                      backgroundColor: 'rgba(96, 165, 250, 0.2)',
                      border: '1px solid rgba(96, 165, 250, 0.3)',
                      borderRadius: '4px',
                      color: '#cbd5e1',
                      cursor: 'pointer',
                      width: '100%',
                    }}
                  >
                    Clear Selection (Animate All)
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* Data Loaded Animation */}
          <div style={{ marginTop: '16px' }}>
            <label
              style={{
                display: 'block',
                color: '#cbd5e1',
                fontSize: '12px',
                marginBottom: '6px',
              }}
            >
              Data Loaded Animation
            </label>
            <select
              value={animation.dataLoadedAnimation ?? 'sides'}
              onChange={(e) =>
                setAnimation({
                  ...animation,
                  dataLoadedAnimation: e.target.value as 'sides' | 'center' | 'none',
                })
              }
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                backgroundColor: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(51, 65, 85, 1)',
                color: '#cbd5e1',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              <option value="sides">Sides (Scale & Fade)</option>
              <option value="center">Center (From Center)</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Types Controls */}
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
          Filter Types
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {currentData.groups.map((group) => (
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

      {/* Group By Control */}
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
          Layout
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#cbd5e1',
              fontSize: '12px',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px',
              backgroundColor: groupBy ? 'rgba(96, 165, 250, 0.1)' : 'transparent',
              transition: 'background-color 0.2s',
            }}
          >
            <input
              type="checkbox"
              checked={groupBy}
              onChange={(e) => setGroupBy(e.target.checked)}
              style={{ accentColor: '#60a5fa' }}
            />
            Group By Type
          </label>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#cbd5e1',
              fontSize: '12px',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px',
              backgroundColor: groupOrbits !== undefined ? 'rgba(96, 165, 250, 0.1)' : 'transparent',
              transition: 'background-color 0.2s',
            }}
          >
            <input
              type="checkbox"
              checked={groupOrbits !== undefined}
              onChange={(e) => {
                if (e.target.checked) {
                  // Auto-assign all visible groups to separate orbits
                  const visibleGroupIds = currentData.groups
                    .filter(g => visibleGroups[g.id] !== false)
                    .map(g => g.id);
                  if (visibleGroupIds.length > 0) {
                    setGroupOrbits(visibleGroupIds.map(id => [id]));
                  } else {
                    setGroupOrbits([[]]);
                  }
                } else {
                  setGroupOrbits(undefined);
                }
              }}
              style={{ accentColor: '#60a5fa' }}
            />
            Group Orbits
          </label>
          {groupOrbits !== undefined && (
            <div style={{ marginTop: '8px', padding: '8px', backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ color: '#94a3b8', fontSize: '11px' }}>
                  Configure Orbits:
                </div>
                <button
                  onClick={() => {
                    setGroupOrbits([...groupOrbits, []]);
                  }}
                  style={{
                    padding: '4px 8px',
                    fontSize: '10px',
                    backgroundColor: 'rgba(96, 165, 250, 0.2)',
                    border: '1px solid rgba(96, 165, 250, 0.3)',
                    borderRadius: '4px',
                    color: '#cbd5e1',
                    cursor: 'pointer',
                  }}
                >
                  + Add Orbit
                </button>
              </div>
              
              {groupOrbits.map((orbit, orbitIndex) => {
                const availableGroups = currentData.groups
                  .filter(g => visibleGroups[g.id] !== false)
                  .map(g => g.id);
                const unassignedGroups = availableGroups.filter(
                  groupId => !groupOrbits.some((o, idx) => idx !== orbitIndex && o.includes(groupId))
                );
                
                return (
                  <div
                    key={orbitIndex}
                    style={{
                      marginBottom: '8px',
                      padding: '8px',
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      borderRadius: '4px',
                      border: '1px solid rgba(51, 65, 85, 0.5)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ color: '#cbd5e1', fontSize: '11px', fontWeight: 600 }}>
                        Orbit {orbitIndex + 1}
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {orbitIndex > 0 && (
                          <button
                            onClick={() => {
                              const newOrbits = [...groupOrbits];
                              [newOrbits[orbitIndex - 1], newOrbits[orbitIndex]] = [newOrbits[orbitIndex], newOrbits[orbitIndex - 1]];
                              setGroupOrbits(newOrbits);
                            }}
                            style={{
                              padding: '2px 6px',
                              fontSize: '9px',
                              backgroundColor: 'rgba(96, 165, 250, 0.2)',
                              border: '1px solid rgba(96, 165, 250, 0.3)',
                              borderRadius: '3px',
                              color: '#cbd5e1',
                              cursor: 'pointer',
                            }}
                          >
                            ↑
                          </button>
                        )}
                        {orbitIndex < groupOrbits.length - 1 && (
                          <button
                            onClick={() => {
                              const newOrbits = [...groupOrbits];
                              [newOrbits[orbitIndex], newOrbits[orbitIndex + 1]] = [newOrbits[orbitIndex + 1], newOrbits[orbitIndex]];
                              setGroupOrbits(newOrbits);
                            }}
                            style={{
                              padding: '2px 6px',
                              fontSize: '9px',
                              backgroundColor: 'rgba(96, 165, 250, 0.2)',
                              border: '1px solid rgba(96, 165, 250, 0.3)',
                              borderRadius: '3px',
                              color: '#cbd5e1',
                              cursor: 'pointer',
                            }}
                          >
                            ↓
                          </button>
                        )}
                        {groupOrbits.length > 1 && (
                          <button
                            onClick={() => {
                              const newOrbits = groupOrbits.filter((_, idx) => idx !== orbitIndex);
                              setGroupOrbits(newOrbits.length > 0 ? newOrbits : undefined);
                            }}
                            style={{
                              padding: '2px 6px',
                              fontSize: '9px',
                              backgroundColor: 'rgba(239, 68, 68, 0.2)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: '3px',
                              color: '#cbd5e1',
                              cursor: 'pointer',
                            }}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Groups in this orbit */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '6px' }}>
                      {orbit.map((groupId, groupIdx) => {
                        const group = currentData.groups.find(g => g.id === groupId);
                        if (!group) return null;
                        return (
                          <div
                            key={groupId}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 6px',
                              backgroundColor: 'rgba(96, 165, 250, 0.2)',
                              borderRadius: '4px',
                              fontSize: '10px',
                              color: '#cbd5e1',
                            }}
                          >
                            <span>{group.label}</span>
                            {orbit.length > 1 && groupIdx > 0 && (
                              <button
                                onClick={() => {
                                  const newOrbits = [...groupOrbits];
                                  const newOrbit = [...orbit];
                                  [newOrbit[groupIdx - 1], newOrbit[groupIdx]] = [newOrbit[groupIdx], newOrbit[groupIdx - 1]];
                                  newOrbits[orbitIndex] = newOrbit;
                                  setGroupOrbits(newOrbits);
                                }}
                                style={{
                                  padding: '1px 3px',
                                  fontSize: '8px',
                                  backgroundColor: 'rgba(96, 165, 250, 0.3)',
                                  border: 'none',
                                  borderRadius: '2px',
                                  color: '#cbd5e1',
                                  cursor: 'pointer',
                                }}
                              >
                                ←
                              </button>
                            )}
                            {orbit.length > 1 && groupIdx < orbit.length - 1 && (
                              <button
                                onClick={() => {
                                  const newOrbits = [...groupOrbits];
                                  const newOrbit = [...orbit];
                                  [newOrbit[groupIdx], newOrbit[groupIdx + 1]] = [newOrbit[groupIdx + 1], newOrbit[groupIdx]];
                                  newOrbits[orbitIndex] = newOrbit;
                                  setGroupOrbits(newOrbits);
                                }}
                                style={{
                                  padding: '1px 3px',
                                  fontSize: '8px',
                                  backgroundColor: 'rgba(96, 165, 250, 0.3)',
                                  border: 'none',
                                  borderRadius: '2px',
                                  color: '#cbd5e1',
                                  cursor: 'pointer',
                                }}
                              >
                                →
                              </button>
                            )}
                            <button
                              onClick={() => {
                                const newOrbits = [...groupOrbits];
                                newOrbits[orbitIndex] = orbit.filter(id => id !== groupId);
                                setGroupOrbits(newOrbits);
                              }}
                              style={{
                                padding: '1px 4px',
                                fontSize: '9px',
                                backgroundColor: 'rgba(239, 68, 68, 0.3)',
                                border: 'none',
                                borderRadius: '2px',
                                color: '#cbd5e1',
                                cursor: 'pointer',
                                marginLeft: '2px',
                              }}
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Add groups to this orbit */}
                    {unassignedGroups.length > 0 && (
                      <select
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            const newOrbits = [...groupOrbits];
                            newOrbits[orbitIndex] = [...orbit, e.target.value];
                            setGroupOrbits(newOrbits);
                            e.target.value = '';
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '4px 6px',
                          fontSize: '10px',
                          backgroundColor: 'rgba(30, 41, 59, 0.8)',
                          border: '1px solid rgba(51, 65, 85, 1)',
                          borderRadius: '4px',
                          color: '#cbd5e1',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="">+ Add group to orbit...</option>
                        {unassignedGroups.map(groupId => {
                          const group = currentData.groups.find(g => g.id === groupId);
                          return group ? (
                            <option key={groupId} value={groupId}>
                              {group.label}
                            </option>
                          ) : null;
                        })}
                      </select>
                    )}
                  </div>
                );
              })}
              
              {/* Unassigned groups */}
              {(() => {
                const assignedGroups = new Set(groupOrbits.flat());
                const unassignedGroups = currentData.groups
                  .filter(g => visibleGroups[g.id] !== false && !assignedGroups.has(g.id))
                  .map(g => g.id);
                
                if (unassignedGroups.length === 0) return null;
                
                return (
                  <div style={{ marginTop: '8px', padding: '8px', backgroundColor: 'rgba(15, 23, 42, 0.4)', borderRadius: '4px' }}>
                    <div style={{ color: '#94a3b8', fontSize: '10px', marginBottom: '6px' }}>
                      Unassigned Groups:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {unassignedGroups.map(groupId => {
                        const group = currentData.groups.find(g => g.id === groupId);
                        if (!group) return null;
                        return (
                          <div
                            key={groupId}
                            style={{
                              padding: '4px 6px',
                              backgroundColor: 'rgba(100, 116, 139, 0.2)',
                              borderRadius: '4px',
                              fontSize: '10px',
                              color: '#94a3b8',
                            }}
                          >
                            {group.label}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Orbit Paths Controls */}
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
          Orbit Paths
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
              checked={orbitPaths.show}
              onChange={(e) =>
                setOrbitPaths({ ...orbitPaths, show: e.target.checked })
              }
              style={{ accentColor: '#60a5fa' }}
            />
            Show Paths
          </label>
          {orbitPaths.show && (
            <>
              <div>
                <label
                  style={{
                    display: 'block',
                    color: '#cbd5e1',
                    fontSize: '12px',
                    marginBottom: '6px',
                  }}
                >
                  Stroke Width: {orbitPaths.strokeWidth}px
                </label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="0.5"
                  value={orbitPaths.strokeWidth}
                  onChange={(e) =>
                    setOrbitPaths({
                      ...orbitPaths,
                      strokeWidth: parseFloat(e.target.value),
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
                  Style
                </label>
                <select
                  value={orbitPaths.strokeDasharray}
                  onChange={(e) =>
                    setOrbitPaths({
                      ...orbitPaths,
                      strokeDasharray: e.target.value,
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid rgba(51, 65, 85, 1)',
                    color: '#cbd5e1',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  <option value="none">Solid</option>
                  <option value="5,5">Dotted</option>
                  <option value="10,5">Dashed</option>
                  <option value="2,2">Fine Dotted</option>
                  <option value="15,5">Long Dashed</option>
                </select>
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
                  Opacity: {orbitPaths.opacity}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={orbitPaths.opacity}
                  onChange={(e) =>
                    setOrbitPaths({
                      ...orbitPaths,
                      opacity: parseFloat(e.target.value),
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
                  Hover Stroke Width: {orbitPaths.hoverStrokeWidth}px
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={orbitPaths.hoverStrokeWidth}
                  onChange={(e) =>
                    setOrbitPaths({
                      ...orbitPaths,
                      hoverStrokeWidth: parseFloat(e.target.value),
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
                  Hover Opacity: {orbitPaths.hoverOpacity}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={orbitPaths.hoverOpacity}
                  onChange={(e) =>
                    setOrbitPaths({
                      ...orbitPaths,
                      hoverOpacity: parseFloat(e.target.value),
                    })
                  }
                  style={{
                    width: '100%',
                    accentColor: '#60a5fa',
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Item Shape Controls */}
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
          Item Shape
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <select
            value={itemShape}
            onChange={(e) => setItemShape(e.target.value as ItemShape)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(51, 65, 85, 1)',
              color: '#cbd5e1',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            <option value="circle">Circle</option>
            <option value="square">Square</option>
            <option value="hexagon">Hexagon</option>
            <option value="octagon">Octagon</option>
            <option value="diamond">Diamond</option>
            <option value="pentagon">Pentagon</option>
            <option value="star">Star</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ChartControlsSidebar;

