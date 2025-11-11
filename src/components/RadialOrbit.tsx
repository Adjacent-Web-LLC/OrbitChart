import { useState, useMemo } from 'react';
import type {
  RadialOrbitProps,
  RadialOrbitGroup,
  RadialOrbitItem,
  ItemShape,
} from '../types/radial-orbit';
import {
  valueToRadius,
  sortItems,
  distributeAngles,
  distributeAnglesGrouped,
  polarToCartesian,
} from '../utils/radial-orbit-helpers';

type TooltipState = {
  visible: boolean;
  x: number;
  y: number;
  content: React.ReactNode;
};

const RadialOrbit: React.FC<RadialOrbitProps> = ({
  data,
  width = 800,
  height = 800,
  sortableBy,
  onGroupSelect,
  onItemSelect,
  onDialSelect,
  renderItem,
  itemShape = 'circle',
  groupBy = false,
  groupOrbits,
  orbitPaths = {
    show: true,
    strokeWidth: 2,
    strokeDasharray: '5,5',
    opacity: 0.7,
    hoverStrokeWidth: 3,
    hoverOpacity: 0.9,
  },
  animation = {
    orbitRotation: true,
    orbitSpeedBase: 60,
    hoverScale: 1.1,
    orbits: undefined, // undefined = animate all, [] = animate none, [ids] = animate selected
  },
  colors = {
    background: 'rgba(0, 0, 0, 0.05)',
    ring: 'rgba(100, 100, 100, 0.2)',
    center: '#1a1a1a',
    tooltip: 'rgba(0, 0, 0, 0.9)',
  },
  style = {},
  enableNestedOrbits = false,
  onZoomIn,
  onZoomOut,
}) => {
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [selectedDial, setSelectedDial] = useState<number | null>(null);
  const [zoomedItem, setZoomedItem] = useState<RadialOrbitItem | null>(null);
  const [zoomAnimation, setZoomAnimation] = useState<'idle' | 'zooming-in' | 'zoomed' | 'zooming-out'>('idle');
  const [zoomOrigin, setZoomOrigin] = useState<{ x: number; y: number; radius: number } | null>(null);
  const [zoomedGroup, setZoomedGroup] = useState<RadialOrbitGroup | null>(null);
  const [clickedItem, setClickedItem] = useState<RadialOrbitItem | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    content: null,
  });

  const centerX = width / 2;
  const centerY = height / 2;
  
  // Merge animation defaults to ensure orbits is properly handled
  const mergedAnimation = {
    orbitRotation: animation.orbitRotation ?? true,
    orbitSpeedBase: animation.orbitSpeedBase ?? 60,
    hoverScale: animation.hoverScale ?? 1.1,
    orbits: animation.orbits, // Can be undefined, [], or string[]
    dataLoadedAnimation: animation.dataLoadedAnimation ?? 'sides', // Default to 'sides'
  };

  // Helper function to get data loaded animation style and transform
  const getDataLoadedAnimationStyle = (
    itemIndex: number,
    finalX: number,
    finalY: number,
    centerX: number,
    centerY: number
  ): { style: React.CSSProperties; animationId?: string } => {
    const animationType = mergedAnimation.dataLoadedAnimation;
    
    if (animationType === 'none') {
      return { style: {} };
    }
    
    const delay = `${itemIndex * 0.05}s`;
    const duration = '0.5s';
    const easing = 'ease-out';
    
    if (animationType === 'center') {
      // Calculate transform to start at center and move to final position
      // Items are positioned at (pos.x, pos.y), center is at (centerX, centerY)
      // To move FROM center TO final position, we need to translate by (centerX - pos.x, centerY - pos.y)
      // This positions the item at center initially, then animate to translate(0, 0) = final position
      const startTranslateX = centerX - finalX;
      const startTranslateY = centerY - finalY;
      
      // Create unique animation ID based on start position
      const animationId = `fromCenter-${Math.round(startTranslateX)}-${Math.round(startTranslateY)}`;
      
      return {
        style: {
          animation: `${animationId} ${duration} ${easing}`,
          animationDelay: delay,
          animationFillMode: 'backwards',
        } as React.CSSProperties,
        animationId,
      };
    }
    
    // Default: 'sides' - scale and fade in from position
    return {
      style: {
        animation: 'radial-orbit-fadeIn 0.5s ease-out',
        animationDelay: delay,
        animationFillMode: 'backwards',
      },
    };
  };

  // Helper function to get shape styles
  const getShapeStyles = (shape: ItemShape): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      overflow: 'hidden',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      boxSizing: 'border-box',
    };

    switch (shape) {
      case 'circle':
        return {
          ...baseStyle,
          borderRadius: '50%',
        };
      case 'square':
        return {
          ...baseStyle,
          borderRadius: '0%',
        };
      case 'hexagon':
        return {
          ...baseStyle,
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
          borderRadius: '0%',
        };
      case 'octagon':
        return {
          ...baseStyle,
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
          borderRadius: '0%',
        };
      case 'diamond':
        return {
          ...baseStyle,
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          borderRadius: '0%',
        };
      case 'pentagon':
        return {
          ...baseStyle,
          clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
          borderRadius: '0%',
        };
      case 'star':
        return {
          ...baseStyle,
          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
          borderRadius: '0%',
        };
      default:
        return {
          ...baseStyle,
          borderRadius: '50%',
        };
    }
  };
  
  // Calculate scale factor based on container size (using minimum dimension for square aspect ratio)
  const minDimension = Math.min(width, height);
  const scaleFactor = minDimension / 800; // Base size is 800px
  
  // Dynamic sizes that scale with container
  const centerRadius = 60 * scaleFactor;
  const dialRadius = centerRadius + 40 * scaleFactor;
  const baseOrbitRadius = dialRadius + 60 * scaleFactor;
  const baseOrbitSpacing = 120 * scaleFactor;
  
  // Item size constants
  const minItemRadius = 8 * scaleFactor;
  const maxItemRadius = 32 * scaleFactor;
  const hoverScale = mergedAnimation.hoverScale ?? 1.1;
  const maxItemRadiusWithHover = maxItemRadius * hoverScale;
  
  // Calculate maximum available radius (leave padding for items)
  const maxAvailableRadius = Math.min(width, height) / 2 - maxItemRadiusWithHover - 20 * scaleFactor;

  // Helper function to calculate maximum item radius for a group
  const getMaxItemRadiusForGroup = (
    items: RadialOrbitItem[],
    minValue: number,
    maxValue: number
  ): number => {
    if (items.length === 0) return minItemRadius;
    // Find the item with maximum value (which will have maximum radius)
    const maxValueItem = items.reduce((max, item) => 
      item.value > max.value ? item : max, items[0]
    );
    return valueToRadius(
      maxValueItem.value,
      minValue,
      maxValue,
      minItemRadius,
      maxItemRadius
    ) * hoverScale; // Account for hover scale
  };

  const processedGroups = useMemo(() => {
    // If groupOrbits is provided, reorganize groups into orbits
    if (groupOrbits && groupOrbits.length > 0) {
      const groupMap = new Map(data.groups.map(g => [g.id, g]));
      const processedOrbits: Array<{
        orbitIndex: number;
        radius: number;
        groups: Array<{
          group: RadialOrbitGroup;
          sortedItems: RadialOrbitItem[];
          minValue: number;
          maxValue: number;
          itemStartIndex: number;
        }>;
        allItems: Array<{ item: RadialOrbitItem; group: RadialOrbitGroup }>;
        angles: number[];
      }> = [];

      // First pass: collect all orbit data and calculate max item radii
      const orbitData: Array<{
        orbitIndex: number;
        orbitGroupIds: string[];
        groups: RadialOrbitGroup[];
        maxItemRadius: number;
        allItems: Array<{ item: RadialOrbitItem; group: RadialOrbitGroup }>;
        groupsWithItems: Array<{
          group: RadialOrbitGroup;
          sortedItems: RadialOrbitItem[];
          minValue: number;
          maxValue: number;
          itemStartIndex: number;
        }>;
      }> = [];

      groupOrbits.forEach((orbitGroupIds, orbitIndex) => {
        // Get groups for this orbit
        const orbitGroups = orbitGroupIds
          .map(id => groupMap.get(id))
          .filter((g): g is RadialOrbitGroup => g !== undefined);

        if (orbitGroups.length === 0) return;

        // Collect all items from all groups in this orbit, maintaining order
        const allItems: Array<{ item: RadialOrbitItem; group: RadialOrbitGroup }> = [];
        const groupsWithItems: Array<{
          group: RadialOrbitGroup;
          sortedItems: RadialOrbitItem[];
          minValue: number;
          maxValue: number;
          itemStartIndex: number;
        }> = [];

        orbitGroups.forEach((group) => {
          const sortedItems = sortItems(group.items, sortableBy);
          const allValues = sortedItems.map((item) => item.value);
          const minValue = Math.min(...allValues);
          const maxValue = Math.max(...allValues);
          const itemStartIndex = allItems.length;

          sortedItems.forEach(item => {
            allItems.push({ item, group });
          });

          groupsWithItems.push({
            group,
            sortedItems,
            minValue,
            maxValue,
            itemStartIndex,
          });
        });

        // Calculate maximum item radius for this orbit
        const maxItemRadius = Math.max(
          ...groupsWithItems.map(g => getMaxItemRadiusForGroup(g.sortedItems, g.minValue, g.maxValue)),
          minItemRadius * hoverScale
        );

        orbitData.push({
          orbitIndex,
          orbitGroupIds,
          groups: orbitGroups,
          maxItemRadius,
          allItems,
          groupsWithItems,
        });
      });

      // Second pass: calculate radii with proper spacing to avoid overlaps
      const calculatedRadii: number[] = [];
      orbitData.forEach((orbit, orbitIndex) => {
        let radius: number;
        
        if (orbitIndex === 0) {
          // First orbit: center items at base radius, accounting for item size
          // Items extend from (baseOrbitRadius - maxItemRadius) to (baseOrbitRadius + maxItemRadius)
          // We want the orbit center to be at baseOrbitRadius, so items don't overlap with center
          radius = baseOrbitRadius + orbit.maxItemRadius;
        } else {
          // Subsequent orbits: ensure no overlap with previous orbit
          // Previous orbit outer edge: prevRadius + prevMaxItemRadius
          // Current orbit inner edge: radius - maxItemRadius
          // Need: radius - maxItemRadius >= prevRadius + prevMaxItemRadius + padding
          // So: radius >= prevRadius + prevMaxItemRadius + maxItemRadius + padding
          const prevRadius = calculatedRadii[orbitIndex - 1];
          const prevOrbit = orbitData[orbitIndex - 1];
          const padding = 20 * scaleFactor; // Minimum padding between orbits
          radius = prevRadius + prevOrbit.maxItemRadius + padding + orbit.maxItemRadius;
        }

        calculatedRadii.push(radius);
      });

      // Third pass: adjust radii if they exceed available space
      const maxOuterEdge = Math.max(...calculatedRadii.map((r, i) => r + orbitData[i].maxItemRadius));
      if (maxOuterEdge > maxAvailableRadius) {
        // Scale down proportionally
        const radiusScale = (maxAvailableRadius - baseOrbitRadius) / (maxOuterEdge - baseOrbitRadius);
        calculatedRadii.forEach((radius, i) => {
          calculatedRadii[i] = baseOrbitRadius + (radius - baseOrbitRadius) * radiusScale;
        });
      }

      // Final pass: create processed orbits with calculated radii
      orbitData.forEach((orbit, orbitIndex) => {
        const radius = calculatedRadii[orbitIndex];

        // Distribute angles for all items in this orbit
        const angles = groupBy
          ? distributeAnglesGrouped(orbit.allItems.length, orbitIndex, groupOrbits.length)
          : distributeAngles(orbit.allItems.length);

        processedOrbits.push({
          orbitIndex: orbit.orbitIndex,
          radius,
          groups: orbit.groupsWithItems,
          allItems: orbit.allItems,
          angles,
        });
      });

      // Convert back to flat structure for rendering
      const flatGroups: Array<RadialOrbitGroup & {
        sortedItems: RadialOrbitItem[];
        radius: number;
        minValue: number;
        maxValue: number;
        angles: number[];
        orbitIndex: number;
        itemStartIndex: number;
      }> = [];

      processedOrbits.forEach((orbit) => {
        orbit.groups.forEach((groupData) => {
          // Get angles for this group's items
          const groupAngles = orbit.angles.slice(
            groupData.itemStartIndex,
            groupData.itemStartIndex + groupData.sortedItems.length
          );

          flatGroups.push({
            ...groupData.group,
            sortedItems: groupData.sortedItems,
            radius: orbit.radius,
            minValue: groupData.minValue,
            maxValue: groupData.maxValue,
            angles: groupAngles,
            orbitIndex: orbit.orbitIndex,
            itemStartIndex: groupData.itemStartIndex,
          });
        });
      });

      return flatGroups;
    }

    // Default behavior: one group per orbit
    // First pass: calculate max item radii for each group
    const groupData = data.groups.map((group, index) => {
      const sortedItems = sortItems(group.items, sortableBy);
      const allValues = sortedItems.map((item) => item.value);
      const minValue = Math.min(...allValues);
      const maxValue = Math.max(...allValues);
      const maxItemRadius = getMaxItemRadiusForGroup(sortedItems, minValue, maxValue);
      
      return {
        group,
        sortedItems,
        minValue,
        maxValue,
        maxItemRadius,
        index,
      };
    });

    // Second pass: calculate radii with proper spacing
    const calculatedRadii: number[] = [];
    groupData.forEach((groupDataItem, index) => {
      let radius: number;
      
      if (index === 0) {
        // First orbit: center items at base radius, accounting for item size
        radius = baseOrbitRadius + groupDataItem.maxItemRadius;
      } else {
        // Subsequent orbits: ensure no overlap with previous orbit
        // Previous orbit outer edge: prevRadius + prevMaxItemRadius
        // Current orbit inner edge: radius - maxItemRadius
        // Need: radius - maxItemRadius >= prevRadius + prevMaxItemRadius + padding
        // So: radius >= prevRadius + prevMaxItemRadius + maxItemRadius + padding
        const prevRadius = calculatedRadii[index - 1];
        const prevGroupData = groupData[index - 1];
        const padding = 20 * scaleFactor; // Minimum padding between orbits
        radius = prevRadius + prevGroupData.maxItemRadius + padding + groupDataItem.maxItemRadius;
      }

      // Use explicit radius if provided, but still account for item size to avoid overlaps
      if (groupDataItem.group.radius) {
        // If explicit radius is provided, use it but ensure it doesn't overlap with previous orbit
        if (index > 0) {
          const prevRadius = calculatedRadii[index - 1];
          const prevGroupData = groupData[index - 1];
          const padding = 20 * scaleFactor;
          const minRadius = prevRadius + prevGroupData.maxItemRadius + padding + groupDataItem.maxItemRadius;
          radius = Math.max(groupDataItem.group.radius + groupDataItem.maxItemRadius, minRadius);
        } else {
          radius = groupDataItem.group.radius + groupDataItem.maxItemRadius;
        }
      }

      calculatedRadii.push(radius);
    });

    // Third pass: adjust radii if they exceed available space
    const maxOuterEdge = Math.max(...calculatedRadii.map((r, i) => r + groupData[i].maxItemRadius));
    if (maxOuterEdge > maxAvailableRadius) {
      // Scale down proportionally
      const radiusScale = (maxAvailableRadius - baseOrbitRadius) / (maxOuterEdge - baseOrbitRadius);
      calculatedRadii.forEach((radius, i) => {
        calculatedRadii[i] = baseOrbitRadius + (radius - baseOrbitRadius) * radiusScale;
      });
    }

    // Final pass: create groups with calculated radii
    const groups = groupData.map((groupDataItem, index) => {
      const radius = calculatedRadii[index];

      // Use grouped angles if groupBy is enabled, otherwise distribute evenly
      const angles = groupBy
        ? distributeAnglesGrouped(groupDataItem.sortedItems.length, index, data.groups.length)
        : distributeAngles(groupDataItem.sortedItems.length);

      return {
        ...groupDataItem.group,
        sortedItems: groupDataItem.sortedItems,
        radius,
        minValue: groupDataItem.minValue,
        maxValue: groupDataItem.maxValue,
        angles,
        orbitIndex: index,
        itemStartIndex: 0,
      } as RadialOrbitGroup & {
        sortedItems: RadialOrbitItem[];
        radius: number;
        minValue: number;
        maxValue: number;
        angles: number[];
        orbitIndex: number;
        itemStartIndex: number;
      };
    });
    
    return groups;
  }, [data.groups, sortableBy, baseOrbitRadius, maxAvailableRadius, groupBy, groupOrbits, scaleFactor, hoverScale, minItemRadius, maxItemRadius]);

  const handleGroupHover = (
    group: RadialOrbitGroup | null,
    event?: React.MouseEvent
  ) => {
    setHoveredGroup(group?.id || null);
    if (group && event) {
      setTooltip({
        visible: true,
        x: event.clientX,
        y: event.clientY,
        content: (
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>{group.label}</div>
            <div style={{ fontSize: '12px', opacity: 0.75 }}>{group.items.length} items</div>
          </div>
        ),
      });
    } else {
      setTooltip({ visible: false, x: 0, y: 0, content: null });
    }
  };

  const handleItemHover = (
    item: RadialOrbitItem | null,
    event?: React.MouseEvent
  ) => {
    setHoveredItem(item?.id || null);
    if (item && event) {
      setTooltip({
        visible: true,
        x: event.clientX,
        y: event.clientY,
        content: (
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>{item.label}</div>
            <div style={{ fontSize: '12px', opacity: 0.75 }}>Value: {item.value}</div>
            {enableNestedOrbits && item.nestedData && (
              <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '4px', fontStyle: 'italic' }}>
                Click to view nested orbit
              </div>
            )}
            {item.meta && (
              <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '4px' }}>
                {Object.entries(item.meta)
                  .slice(0, 3)
                  .map(([key, val]) => (
                    <div key={key}>
                      {key}: {String(val)}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ),
      });
    } else if (!hoveredGroup) {
      setTooltip({ visible: false, x: 0, y: 0, content: null });
    }
  };

  const handleItemClick = (item: RadialOrbitItem, group: RadialOrbitGroup, position?: { x: number; y: number }, itemRadius?: number) => {
    if (enableNestedOrbits && item.nestedData && !zoomedItem) {
      // Store the clicked item and its position/radius for zoom animation
      setClickedItem(item);
      if (position && itemRadius !== undefined) {
        setZoomOrigin({ x: position.x, y: position.y, radius: itemRadius });
        setZoomedGroup(group);
      }
      // Start zoom animation - don't set zoomedItem yet
      setZoomAnimation('zooming-in');
      // After animation completes, show the nested orbit
      setTimeout(() => {
        setZoomedItem(item);
        setZoomAnimation('zoomed');
        setClickedItem(null); // Clear clicked item after transition
        onZoomIn?.(item);
      }, 800); // Match animation duration
    } else {
      // Normal click handler
      onItemSelect?.(item, group);
    }
  };

  const handleZoomOut = () => {
    setZoomAnimation('zooming-out');
    setTimeout(() => {
      setZoomedItem(null);
      setZoomOrigin(null);
      setZoomedGroup(null);
      setClickedItem(null);
      setZoomAnimation('idle');
      onZoomOut?.();
    }, 800); // Match zoom-in duration
  };

  const handleDialClick = (index: number) => {
    setSelectedDial(index);
    onDialSelect?.(index);
  };

  const dialTicks = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const angle = (i * Math.PI * 2) / 12 - Math.PI / 2;
      const innerPos = polarToCartesian(centerX, centerY, dialRadius - 10, angle);
      const outerPos = polarToCartesian(centerX, centerY, dialRadius + 10, angle);
      return { index: i, innerPos, outerPos, angle };
    });
  }, [centerX, centerY, dialRadius]);

  // If zoomed into a nested orbit, render that instead
  if (zoomedItem && zoomedItem.nestedData && enableNestedOrbits) {
    // Calculate transform for seamless zoom from item position to center
    const translateX = zoomOrigin ? centerX - zoomOrigin.x : 0;
    const translateY = zoomOrigin ? centerY - zoomOrigin.y : 0;
    const startRadius = zoomOrigin?.radius || 20;
    const endRadius = centerRadius;
    const scaleRatio = endRadius / startRadius;
    
    // Create modified nested data with the clicked item's imageUrl in the center
    const modifiedNestedData = {
      ...zoomedItem.nestedData,
      center: {
        ...zoomedItem.nestedData.center,
        imageUrl: zoomedItem.iconUrl || zoomedItem.nestedData.center.imageUrl,
      },
    };
    
    return (
      <div
        style={{
          position: 'relative',
          width,
          height,
          background: colors.background,
          overflow: 'hidden',
          ...style,
        }}
      >
        {/* Animated item overlay that moves to center - only show during zoom-in */}
        {zoomOrigin && zoomAnimation === 'zooming-in' && (
          <div
            style={{
              position: 'absolute',
              left: zoomOrigin.x,
              top: zoomOrigin.y,
              width: startRadius * 2,
              height: startRadius * 2,
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
              animation: 'item-zoom-to-center 0.8s ease-out forwards',
              pointerEvents: 'none',
            }}
          >
            {zoomedItem.iconUrl ? (
              <img
                src={zoomedItem.iconUrl}
                alt={zoomedItem.label}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  backgroundColor: zoomedItem.color || zoomedGroup?.color || '#60a5fa',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                }}
              />
            )}
          </div>
        )}
        
        {/* Nested orbit content - only show after animation completes */}
        {zoomAnimation === 'zoomed' && (
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              animation: 'fade-in 0.3s ease-in',
            }}
          >
            <button
              onClick={handleZoomOut}
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                zIndex: 1001,
                padding: '8px 16px',
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                border: '1px solid rgba(51, 65, 85, 1)',
                borderRadius: '8px',
                color: '#cbd5e1',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(51, 65, 85, 0.9)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.9)';
              }}
            >
              <span>←</span>
              <span>Back to {zoomedItem.label}</span>
            </button>
            <RadialOrbit
              data={modifiedNestedData}
              width={width}
              height={height}
              sortableBy={sortableBy}
              onGroupSelect={onGroupSelect}
              onItemSelect={onItemSelect}
              onDialSelect={onDialSelect}
              renderItem={renderItem}
              itemShape={itemShape}
              groupBy={groupBy}
              groupOrbits={groupOrbits}
              orbitPaths={orbitPaths}
              animation={animation}
              colors={colors}
              enableNestedOrbits={enableNestedOrbits}
              onZoomIn={onZoomIn}
              onZoomOut={onZoomOut}
            />
          </div>
        )}
        
        <style>{`
          @keyframes item-zoom-to-center {
            0% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
            100% {
              transform: translate(${translateX - startRadius}px, ${translateY - startRadius}px) scale(${scaleRatio});
              opacity: 1;
            }
          }
          @keyframes fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}</style>
      </div>
    );
  }
  
  // Show zoom animation overlay when zooming in but zoomedItem not set yet
  if (zoomAnimation === 'zooming-in' && zoomOrigin && clickedItem && !zoomedItem) {
    const translateX = centerX - zoomOrigin.x;
    const translateY = centerY - zoomOrigin.y;
    const startRadius = zoomOrigin.radius || 20;
    const endRadius = centerRadius;
    const scaleRatio = endRadius / startRadius;
    
    return (
      <div
        style={{
          position: 'relative',
          width,
          height,
          background: colors.background,
          overflow: 'hidden',
          ...style,
        }}
      >
        {/* Animated item overlay that moves to center */}
        <div
          style={{
            position: 'absolute',
            left: zoomOrigin.x,
            top: zoomOrigin.y,
            width: startRadius * 2,
            height: startRadius * 2,
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            animation: 'item-zoom-to-center 0.8s ease-out forwards',
            pointerEvents: 'none',
          }}
        >
          {clickedItem.iconUrl ? (
            <img
              src={clickedItem.iconUrl}
              alt={clickedItem.label}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                backgroundColor: clickedItem.color || zoomedGroup?.color || '#60a5fa',
                border: '2px solid rgba(255, 255, 255, 0.3)',
              }}
            />
          )}
        </div>
        
        <style>{`
          @keyframes item-zoom-to-center {
            0% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
            100% {
              transform: translate(${translateX - startRadius}px, ${translateY - startRadius}px) scale(${scaleRatio});
              opacity: 1;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        background: colors.background,
        overflow: 'hidden',
        ...style,
        animation: zoomAnimation === 'zooming-out' ? 'zoom-out 0.3s ease-out' : 'none',
      }}
    >
      <svg
        width={width}
        height={height}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
        }}
        viewBox={`0 0 ${width} ${height}`}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="centerGradient">
            <stop offset="0%" stopColor={colors.center} stopOpacity="1" />
            <stop offset="100%" stopColor={colors.center} stopOpacity="0.8" />
          </radialGradient>
        </defs>

        {orbitPaths.show !== false && (() => {
          // When groupOrbits is used, render one ring per unique radius
          // Otherwise, render one ring per group
          if (groupOrbits && groupOrbits.length > 0) {
            const uniqueOrbits = new Map<number, RadialOrbitGroup[]>();
            processedGroups.forEach((group) => {
              const existing = uniqueOrbits.get(group.radius) || [];
              uniqueOrbits.set(group.radius, [...existing, group]);
            });

            return Array.from(uniqueOrbits.entries()).map(([radius, groups]) => {
              // Use first group's color for the ring
              const firstGroup = groups[0];
              let ringColor = colors.ring;
              if (firstGroup.id === 'finance') {
                ringColor = 'rgba(16, 185, 129, 0.7)'; // green
              } else if (firstGroup.id === 'company-stack') {
                ringColor = 'rgba(234, 179, 8, 0.7)'; // yellow
              } else if (firstGroup.id === 'shadow-it') {
                ringColor = 'rgba(239, 68, 68, 0.7)'; // red
              }

              const isHovered = groups.some(g => hoveredGroup === g.id);
              const strokeWidth = isHovered 
                ? (orbitPaths.hoverStrokeWidth ?? orbitPaths.strokeWidth ?? 3)
                : (orbitPaths.strokeWidth ?? 2);
              const opacity = isHovered
                ? (orbitPaths.hoverOpacity ?? orbitPaths.opacity ?? 0.9)
                : (orbitPaths.opacity ?? 0.7);

              return (
                <g key={`orbit-${radius}`}>
                  <circle
                    cx={centerX}
                    cy={centerY}
                    r={radius}
                    fill="none"
                    stroke={ringColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={orbitPaths.strokeDasharray === 'none' ? 'none' : (orbitPaths.strokeDasharray ?? '5,5')}
                    opacity={opacity}
                    style={{
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => handleGroupHover(firstGroup, e)}
                    onMouseLeave={() => handleGroupHover(null)}
                    onClick={() => onGroupSelect?.(firstGroup)}
                  />
                </g>
              );
            });
          }

          // Default: one ring per group
          return processedGroups.map((group) => {
            // Determine ring color based on group type
            let ringColor = colors.ring;
            if (group.id === 'finance') {
              ringColor = 'rgba(16, 185, 129, 0.7)'; // green - more visible
            } else if (group.id === 'company-stack') {
              ringColor = 'rgba(234, 179, 8, 0.7)'; // yellow - more visible
            } else if (group.id === 'shadow-it') {
              ringColor = 'rgba(239, 68, 68, 0.7)'; // red - more visible
            }

            const isHovered = hoveredGroup === group.id;
            const strokeWidth = isHovered 
              ? (orbitPaths.hoverStrokeWidth ?? orbitPaths.strokeWidth ?? 3)
              : (orbitPaths.strokeWidth ?? 2);
            const opacity = isHovered
              ? (orbitPaths.hoverOpacity ?? orbitPaths.opacity ?? 0.9)
              : (orbitPaths.opacity ?? 0.7);

            return (
              <g key={group.id}>
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={group.radius}
                  fill="none"
                  stroke={ringColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={orbitPaths.strokeDasharray === 'none' ? 'none' : (orbitPaths.strokeDasharray ?? '5,5')}
                  opacity={opacity}
                  style={{
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => handleGroupHover(group, e)}
                  onMouseLeave={() => handleGroupHover(null)}
                  onClick={() => onGroupSelect?.(group)}
                />
              </g>
            );
          });
        })()}

        {dialTicks.map((tick) => (
          <g key={tick.index}>
            <line
              x1={tick.innerPos.x}
              y1={tick.innerPos.y}
              x2={tick.outerPos.x}
              y2={tick.outerPos.y}
              stroke={selectedDial === tick.index ? '#60a5fa' : '#555'}
              strokeWidth={selectedDial === tick.index ? 3 : 2}
              style={{
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.setAttribute('stroke', '#60a5fa');
              }}
              onMouseLeave={(e) => {
                if (selectedDial !== tick.index) {
                  e.currentTarget.setAttribute('stroke', '#555');
                }
              }}
              onClick={() => handleDialClick(tick.index)}
            />
          </g>
        ))}

        <circle
          cx={centerX}
          cy={centerY}
          r={centerRadius}
          fill="url(#centerGradient)"
          stroke={colors.center}
          strokeWidth={3}
        />

        {data.center.imageUrl ? (
          <image
            href={data.center.imageUrl}
            x={centerX - centerRadius + 10}
            y={centerY - centerRadius + 10}
            width={centerRadius * 2 - 20}
            height={centerRadius * 2 - 20}
            clipPath="circle()"
          />
        ) : null}

        <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize={16 * scaleFactor}
          fontWeight="bold"
        >
          {data.center.label}
        </text>
        {data.center.subtitle && (
          <text
            x={centerX}
            y={centerY + 20 * scaleFactor}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize={10 * scaleFactor}
            opacity="0.7"
          >
            {data.center.subtitle}
          </text>
        )}

        {(() => {
          // Collect all items for center animation keyframe generation
          const centerAnimationKeyframes = new Map<string, { x: number; y: number }>();
          if (mergedAnimation.dataLoadedAnimation === 'center') {
            processedGroups.forEach((group) => {
              group.sortedItems.forEach((_item, itemIndex) => {
                const angle = group.angles[itemIndex];
                const pos = polarToCartesian(centerX, centerY, group.radius, angle);
                const startTranslateX = centerX - pos.x;
                const startTranslateY = centerY - pos.y;
                const animationId = `fromCenter-${Math.round(startTranslateX)}-${Math.round(startTranslateY)}`;
                if (!centerAnimationKeyframes.has(animationId)) {
                  centerAnimationKeyframes.set(animationId, { x: startTranslateX, y: startTranslateY });
                }
              });
            });
          }

          // Group by orbit (radius) to handle shared orbits
          const groupsByOrbit = new Map<number, Array<typeof processedGroups[0]>>();
          processedGroups.forEach((group) => {
            const radius = group.radius;
            if (!groupsByOrbit.has(radius)) {
              groupsByOrbit.set(radius, []);
            }
            groupsByOrbit.get(radius)!.push(group);
          });

          return Array.from(groupsByOrbit.entries()).map(([radius, groupsInOrbit]) => {
            const firstGroup = groupsInOrbit[0];
            const orbitIndex = ('orbitIndex' in firstGroup ? firstGroup.orbitIndex : processedGroups.indexOf(firstGroup)) as number;
            
            // Check if any item in any group in this orbit is hovered
            const hasHoveredItem = groupsInOrbit.some(g => g.sortedItems.some(item => hoveredItem === item.id));
            
            // Check if this orbit should animate - check if ANY group in this orbit is selected
            // If mergedAnimation.orbits is undefined, animate all. If it's an array (even empty), only animate selected ones.
            const shouldAnimate = mergedAnimation.orbitRotation && 
              (mergedAnimation.orbits === undefined || 
               (mergedAnimation.orbits.length > 0 && groupsInOrbit.some(g => mergedAnimation.orbits!.includes(g.id))));
            
            // Calculate animation duration and direction
            const animationDuration = mergedAnimation.orbitSpeedBase! * (orbitIndex % 2 === 0 ? 1 : -1);
            const animationName = 'radial-orbit-rotate';
            
            return (
              <g
                key={`orbit-${radius}`}
                style={{
                  animation: shouldAnimate
                    ? `${animationName} ${Math.abs(animationDuration)}s linear infinite`
                    : 'none',
                  animationDirection: shouldAnimate && animationDuration < 0 ? 'reverse' : 'normal',
                  animationPlayState: shouldAnimate && hasHoveredItem ? 'paused' : (shouldAnimate ? 'running' : 'paused'),
                  transformOrigin: `${centerX}px ${centerY}px`,
                }}
              >
                {groupsInOrbit.map((group) => (
                  <g key={group.id}>
                    {group.sortedItems.map((item, itemIndex) => {
                      const angle = group.angles[itemIndex];
                      const pos = polarToCartesian(centerX, centerY, group.radius, angle);
                      
                      // Calculate item radius based on value
                      const itemRadius = valueToRadius(
                        item.value,
                        group.minValue,
                        group.maxValue,
                        minItemRadius,
                        maxItemRadius
                      );
                      
                      const isHovered = hoveredItem === item.id;
                      const isGroupHovered = hoveredGroup === group.id;
                      const scale =
                        isHovered || isGroupHovered ? mergedAnimation.hoverScale : 1;
                      const animationData = getDataLoadedAnimationStyle(
                        itemIndex,
                        pos.x,
                        pos.y,
                        centerX,
                        centerY
                      );

                      if (renderItem) {
                        // For center animation, wrap in a group with CSS transform
                        if (mergedAnimation.dataLoadedAnimation === 'center') {
                          const startTranslateX = centerX - pos.x;
                          const startTranslateY = centerY - pos.y;
                          const animationId = `fromCenter-${Math.round(startTranslateX)}-${Math.round(startTranslateY)}`;
                          
                        return (
                              <foreignObject
                                x={pos.x - itemRadius * 0.55}
                                y={pos.y - itemRadius * 0.55}
                                width={itemRadius * 1.1}
                                height={itemRadius * 1.1}
                                key={item.id}
                                style={{
                                  animation: `${animationId} 0.5s ease-out`,
                                  animationDelay: `${itemIndex * 0.05}s`,
                                  animationFillMode: 'backwards',
                                  transformOrigin: `${centerX}px ${centerY}px`,
                                }}
                              >
                                {renderItem({
                                  item,
                                  group,
                                  position: pos,
                                  radius: itemRadius,
                                  angle,
                                  isHovered,
                                  isGroupHovered,
                                  scale,
                                  itemIndex,
                                  groupIndex: orbitIndex,
                                  centerX,
                                  centerY,
                                  onMouseEnter: (e) => handleItemHover(item, e),
                                  onMouseLeave: () => handleItemHover(null),
                                  onClick: () => handleItemClick(item, group, pos, itemRadius),
                                })}
                              </foreignObject>
                          );
                        }
                        
                        return (
                        <foreignObject
                            key={item.id}
                            x={pos.x - itemRadius * 0.55}
                            y={pos.y - itemRadius * 0.55}
                            width={itemRadius * 1.1}
                            height={itemRadius * 1.1}
                            style={animationData.style}
                        >
                            {renderItem({
                              item,
                              group,
                              position: pos,
                              radius: itemRadius,
                              angle,
                              isHovered,
                              isGroupHovered,
                              scale,
                              itemIndex,
                              groupIndex: orbitIndex,
                              centerX,
                              centerY,
                              onMouseEnter: (e) => handleItemHover(item, e),
                              onMouseLeave: () => handleItemHover(null),
                                  onClick: () => handleItemClick(item, group, pos, itemRadius),
                            })}
                          </foreignObject>
                        );
                      }

                      // For center animation, wrap in a group with CSS transform
                      if (mergedAnimation.dataLoadedAnimation === 'center') {
                        const startTranslateX = centerX - pos.x;
                        const startTranslateY = centerY - pos.y;
                        const animationId = `fromCenter-${Math.round(startTranslateX)}-${Math.round(startTranslateY)}`;
                        
                        return (
                          <g
                            key={item.id}
                            style={{
                              animation: `${animationId} 0.5s ease-out`,
                              animationDelay: `${itemIndex * 0.05}s`,
                              animationFillMode: 'backwards',
                              transformOrigin: `${centerX}px ${centerY}px`,
                            }}
                          >
                            <circle
                              cx={pos.x}
                              cy={pos.y}
                              r={itemRadius * scale}
                              fill={item.color || group.color || '#60a5fa'}
                              stroke="rgba(255, 255, 255, 0.3)"
                              strokeWidth="2"
                              filter={item.glow ? 'url(#glow)' : 'none'}
                                style={{
                                  cursor: enableNestedOrbits && item.nestedData ? 'zoom-in' : 'pointer',
                                  transition: 'all 0.3s ease',
                                  opacity: isHovered ? 1 : 0.85,
                                }}
                              onMouseEnter={(e) => handleItemHover(item, e)}
                              onMouseLeave={() => handleItemHover(null)}
                              onClick={() => handleItemClick(item, group, pos, itemRadius)}
                            />
                            {item.iconUrl && (
                              <image
                                href={item.iconUrl}
                                x={pos.x - itemRadius * 0.55}
                                y={pos.y - itemRadius * 0.55}
                                width={itemRadius * 1.1}
                                height={itemRadius * 1.1}
                                style={{ pointerEvents: 'none' }}
                              />
                            )}
                            {isHovered && (
                              <text
                                x={pos.x}
                                y={pos.y + itemRadius + 15 * scaleFactor}
                                textAnchor="middle"
                                fill="white"
                                fontSize={11 * scaleFactor}
                                fontWeight="500"
                                style={{ pointerEvents: 'none' }}
                              >
                                {item.label}
                              </text>
                            )}
                          </g>
                        );
                      }

                      return (
                        <g
                          key={item.id}
                          style={animationData.style}
                        >
                          {itemShape === 'circle' && !item.iconUrl ? (
                            // Use SVG circle for simple circles without icons (more performant)
                            <circle
                              cx={pos.x}
                              cy={pos.y}
                              r={itemRadius * scale}
                              fill={item.color || group.color || '#60a5fa'}
                              stroke="rgba(255, 255, 255, 0.3)"
                              strokeWidth="2"
                              filter={item.glow ? 'url(#glow)' : 'none'}
                                style={{
                                  cursor: enableNestedOrbits && item.nestedData ? 'zoom-in' : 'pointer',
                                  transition: 'all 0.3s ease',
                                  opacity: isHovered ? 1 : 0.85,
                                }}
                              onMouseEnter={(e) => handleItemHover(item, e)}
                              onMouseLeave={() => handleItemHover(null)}
                              onClick={() => handleItemClick(item, group, pos, itemRadius)}
                            />
                          ) : (
                            // Use foreignObject for shapes with icons or non-circle shapes
                            <foreignObject
                              x={pos.x - itemRadius * scale}
                              y={pos.y - itemRadius * scale}
                              width={itemRadius * scale * 2}
                              height={itemRadius * scale * 2}
                            >
                              <div
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  ...getShapeStyles(itemShape),
                                  backgroundColor: item.color || group.color || '#60a5fa',
                                  backgroundImage: item.iconUrl ? `url(${item.iconUrl})` : undefined,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                  backgroundRepeat: 'no-repeat',
                                  opacity: isHovered ? 1 : 0.85,
                                  filter: item.glow ? 'drop-shadow(0 0 4px rgba(96, 165, 250, 0.8))' : 'none',
                                }}
                                onMouseEnter={(e) => handleItemHover(item, e as any)}
                                onMouseLeave={() => handleItemHover(null)}
                                onClick={() => handleItemClick(item, group, pos, itemRadius)}
                              />
                            </foreignObject>
                          )}
                          {isHovered && (
                            <text
                              x={pos.x}
                              y={pos.y + itemRadius + 15 * scaleFactor}
                              textAnchor="middle"
                              fill="white"
                              fontSize={11 * scaleFactor}
                              fontWeight="500"
                              style={{ pointerEvents: 'none' }}
                            >
                              {item.label}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </g>
                ))}
              </g>
            );
          });
        })()}
      </svg>

      {tooltip.visible && (
        <div
          style={{
            position: 'fixed',
            zIndex: 50,
            pointerEvents: 'none',
            padding: '8px 12px',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            color: 'white',
            left: tooltip.x + 15,
            top: tooltip.y + 15,
            backgroundColor: colors.tooltip,
          }}
        >
          {tooltip.content}
        </div>
      )}

      <style>{`
        @keyframes radial-orbit-rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes radial-orbit-fadeIn {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        ${(() => {
          // Generate unique keyframes for each center animation start position
          const keyframes: string[] = [];
          const seenIds = new Set<string>();
          
          if (mergedAnimation.dataLoadedAnimation === 'center') {
            processedGroups.forEach((group) => {
              group.sortedItems.forEach((_item, itemIndex) => {
                const angle = group.angles[itemIndex];
                const pos = polarToCartesian(centerX, centerY, group.radius, angle);
                const startTranslateX = centerX - pos.x;
                const startTranslateY = centerY - pos.y;
                const animationId = `fromCenter-${Math.round(startTranslateX)}-${Math.round(startTranslateY)}`;
                
                // Only generate keyframe once per unique position
                if (!seenIds.has(animationId)) {
                  seenIds.add(animationId);
                  keyframes.push(`
                    @keyframes ${animationId} {
                      from {
                        opacity: 0;
                        transform: translate(${startTranslateX}px, ${startTranslateY}px) scale(0);
                      }
                      to {
                        opacity: 1;
                        transform: translate(0, 0) scale(1);
                      }
                    }
                  `);
                }
              });
            });
          }
          return keyframes.join('');
        })()}
      `}</style>
    </div>
  );
};

export default RadialOrbit;
