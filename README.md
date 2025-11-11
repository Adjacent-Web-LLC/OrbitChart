# RadialOrbit Chart Component

A powerful, customizable React component for visualizing hierarchical data in a radial orbit layout. Perfect for displaying organizational structures, technology stacks, relationships, and any data that benefits from a circular, orbit-based visualization.

## Features

- 🎨 **Customizable Shapes**: Support for 7 different item shapes (circle, square, hexagon, octagon, diamond, pentagon, star)
- 🎭 **Custom Renderers**: Full control over item rendering with custom React components
- 🎬 **Animations**: Smooth orbit rotations, hover effects, and data-loaded animations
- 🎯 **Interactive**: Built-in hover states, click handlers, and tooltips
- 📊 **Flexible Layouts**: Group items by type, configure custom orbits, and control visibility
- 🎨 **Theming**: Customizable colors for background, rings, center, and tooltips
- 📱 **Responsive**: Scales automatically based on container size

## Installation

```bash
npm install radial-orbit-chart
# or
yarn add radial-orbit-chart
```

## Basic Usage

```tsx
import RadialOrbit from 'radial-orbit-chart';
import type { RadialOrbitData } from 'radial-orbit-chart/types';

const data: RadialOrbitData = {
  center: {
    id: 'center-1',
    label: 'Center Node',
    subtitle: 'Optional Subtitle',
    avatarUrl: 'https://example.com/avatar.png', // Optional
  },
  groups: [
    {
      id: 'group-1',
      label: 'Group 1',
      color: '#3b82f6', // Optional group color
      items: [
        {
          id: 'item-1',
          label: 'Item 1',
          value: 85,
          color: '#10b981', // Optional item color
          iconUrl: 'https://example.com/icon.png', // Optional
        },
      ],
    },
  ],
};

function App() {
  return (
    <RadialOrbit
      data={data}
      width={800}
      height={800}
      onItemSelect={(item, group) => {
        console.log('Item selected:', item, 'from group:', group);
      }}
    />
  );
}
```

## Data Structure

### RadialOrbitData

The main data structure that contains all chart information.

```typescript
type RadialOrbitData = {
  center: {
    id: string;              // Unique identifier for the center
    label: string;           // Display label
    subtitle?: string;       // Optional subtitle
    avatarUrl?: string;      // Optional avatar/image URL
  };
  groups: RadialOrbitGroup[]; // Array of groups
};
```

### RadialOrbitGroup

Represents a group of items that orbit around the center.

```typescript
type RadialOrbitGroup = {
  id: string;                    // Unique identifier
  label: string;                  // Display label
  items: RadialOrbitItem[];        // Array of items in this group
  radius?: number;                // Optional: Custom orbit radius
  color?: string;                 // Optional: Default color for items in this group
};
```

### RadialOrbitItem

Represents an individual item that orbits around the center.

```typescript
type RadialOrbitItem = {
  id: string;                    // Unique identifier
  label: string;                  // Display label
  value: number;                  // Numeric value (affects item size)
  color?: string;                 // Optional: Item color
  glow?: boolean;                 // Optional: Enable glow effect
  iconUrl?: string;               // Optional: Image/icon URL
  meta?: Record<string, any>;     // Optional: Custom metadata
};
```

### Example Data Structure

```typescript
const exampleData: RadialOrbitData = {
  center: {
    id: 'company',
    label: 'ACME Corp',
    subtitle: 'Enterprise',
    avatarUrl: 'https://example.com/logo.png',
  },
  groups: [
    {
      id: 'finance',
      label: 'Finance',
      color: '#10b981',
      items: [
        {
          id: 'stripe',
          label: 'Stripe',
          value: 95,
          color: '#6366f1',
          glow: true,
          iconUrl: 'https://logo.clearbit.com/stripe.com',
          meta: { category: 'payment' },
        },
        {
          id: 'quickbooks',
          label: 'QuickBooks',
          value: 78,
          color: '#10b981',
          iconUrl: 'https://logo.clearbit.com/quickbooks.intuit.com',
        },
      ],
    },
    {
      id: 'engineering',
      label: 'Engineering',
      color: '#3b82f6',
      items: [
        {
          id: 'github',
          label: 'GitHub',
          value: 100,
          color: '#f97316',
          glow: true,
          iconUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
        },
      ],
    },
  ],
};
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `data` | `RadialOrbitData` | The chart data structure containing center and groups |

### Optional Props

#### Layout & Size

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number` | `800` | Chart width in pixels |
| `height` | `number` | `800` | Chart height in pixels |
| `style` | `CSSProperties` | `{}` | Additional CSS styles for the container |

#### Sorting

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sortableBy` | `'value' \| 'label' \| ((a, b) => number)` | `undefined` | How to sort items within groups. `'value'` sorts by numeric value, `'label'` sorts alphabetically, or provide a custom comparator function |

#### Layout Options

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `groupBy` | `boolean` | `false` | When `true`, groups items by their group type on separate orbits |
| `groupOrbits` | `string[][]` | `undefined` | Custom orbit configuration. Each inner array contains group IDs that should share the same orbit. `undefined` uses automatic layout |

#### Item Rendering

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `itemShape` | `ItemShape` | `'circle'` | Shape of items: `'circle'`, `'square'`, `'hexagon'`, `'octagon'`, `'diamond'`, `'pentagon'`, `'star'` |
| `renderItem` | `(props: ItemRendererProps) => ReactNode` | `undefined` | Custom renderer function for items. When provided, overrides default rendering |

#### Event Handlers

| Prop | Type | Description |
|------|------|-------------|
| `onGroupSelect` | `(group: RadialOrbitGroup) => void` | Callback when a group is clicked |
| `onItemSelect` | `(item: RadialOrbitItem, group: RadialOrbitGroup) => void` | Callback when an item is clicked |
| `onDialSelect` | `(index: number) => void` | Callback when a dial tick is clicked |

#### Orbit Paths

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orbitPaths` | `object` | See below | Configuration for orbit path visualization |

**Orbit Paths Object:**
```typescript
{
  show?: boolean;              // Show/hide orbit paths (default: true)
  strokeWidth?: number;        // Path stroke width in pixels (default: 2)
  strokeDasharray?: string;    // SVG stroke-dasharray (default: '5,5')
  opacity?: number;            // Path opacity 0-1 (default: 0.7)
  hoverStrokeWidth?: number;   // Stroke width on hover (default: 3)
  hoverOpacity?: number;       // Opacity on hover 0-1 (default: 0.9)
}
```

#### Animation

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `animation` | `object` | See below | Animation configuration |

**Animation Object:**
```typescript
{
  orbitRotation?: boolean;           // Enable orbit rotation (default: true)
  orbitSpeedBase?: number;            // Rotation speed in seconds (default: 60)
  hoverScale?: number;                // Scale factor on hover (default: 1.1)
  orbits?: string[];                  // Group IDs to animate. undefined = all, [] = none
  dataLoadedAnimation?: 'sides' | 'center' | 'none'; // Initial load animation (default: 'sides')
}
```

#### Colors

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `colors` | `object` | See below | Color theme configuration |

**Colors Object:**
```typescript
{
  background?: string;    // Chart background color (default: 'rgba(0, 0, 0, 0.05)')
  ring?: string;         // Orbit ring color (default: 'rgba(100, 100, 100, 0.2)')
  center?: string;       // Center circle color (default: '#1a1a1a')
  tooltip?: string;      // Tooltip background color (default: 'rgba(0, 0, 0, 0.9)')
}
```

## Types

### ItemShape

```typescript
type ItemShape = 
  | 'circle' 
  | 'square' 
  | 'hexagon' 
  | 'octagon' 
  | 'diamond' 
  | 'pentagon' 
  | 'star';
```

### ItemRendererProps

Props passed to custom item renderers:

```typescript
type ItemRendererProps = {
  item: RadialOrbitItem;                    // The item being rendered
  group: RadialOrbitGroup;                  // The group this item belongs to
  position: { x: number; y: number };       // SVG coordinates
  radius: number;                           // Item radius
  angle: number;                            // Angle in radians
  isHovered: boolean;                       // Whether item is hovered
  isGroupHovered: boolean;                  // Whether parent group is hovered
  scale: number;                            // Current scale factor
  itemIndex: number;                        // Index within group
  groupIndex: number;                       // Group index
  centerX: number;                          // Chart center X coordinate
  centerY: number;                          // Chart center Y coordinate
  onMouseEnter: (e: MouseEvent<SVGElement>) => void;
  onMouseLeave: () => void;
  onClick: () => void;
};
```

## Examples

### Basic Example

```tsx
import RadialOrbit from 'radial-orbit-chart';

<RadialOrbit
  data={myData}
  width={800}
  height={800}
  onItemSelect={(item, group) => {
    console.log(`Selected ${item.label} from ${group.label}`);
  }}
/>
```

### Custom Shape

```tsx
<RadialOrbit
  data={myData}
  itemShape="hexagon"
  width={800}
  height={800}
/>
```

### Custom Item Renderer

```tsx
<RadialOrbit
  data={myData}
  renderItem={(props) => {
    const { item, position, radius } = props;
    return (
      <foreignObject
        x={position.x - radius}
        y={position.y - radius}
        width={radius * 2}
        height={radius * 2}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundImage: `url(${item.iconUrl})`,
            backgroundSize: 'cover',
            border: '2px solid white',
          }}
        />
      </foreignObject>
    );
  }}
/>
```

### Custom Orbits

```tsx
<RadialOrbit
  data={myData}
  groupOrbits={[
    ['finance', 'hr'],        // Finance and HR share orbit 1
    ['engineering'],          // Engineering gets orbit 2
    ['marketing', 'sales'],  // Marketing and Sales share orbit 3
  ]}
/>
```

### Disable Animations

```tsx
<RadialOrbit
  data={myData}
  animation={{
    orbitRotation: false,
    dataLoadedAnimation: 'none',
  }}
/>
```

### Custom Colors

```tsx
<RadialOrbit
  data={myData}
  colors={{
    background: 'transparent',
    ring: 'rgba(100, 116, 139, 0.3)',
    center: '#1e293b',
    tooltip: 'rgba(15, 23, 42, 0.95)',
  }}
/>
```

### Sort Items

```tsx
// Sort by value (largest first)
<RadialOrbit data={myData} sortableBy="value" />

// Sort alphabetically
<RadialOrbit data={myData} sortableBy="label" />

// Custom sort function
<RadialOrbit
  data={myData}
  sortableBy={(a, b) => {
    // Sort by custom logic
    return a.meta?.priority - b.meta?.priority;
  }}
/>
```

## Advanced Usage

### Group By Type

When `groupBy` is enabled, items are automatically organized into separate orbits based on their group membership:

```tsx
<RadialOrbit
  data={myData}
  groupBy={true}
/>
```

### Custom Orbit Configuration

Use `groupOrbits` to have fine-grained control over which groups share orbits:

```tsx
<RadialOrbit
  data={myData}
  groupOrbits={[
    ['group-1', 'group-2'],  // These groups share the first orbit
    ['group-3'],              // This group gets its own orbit
    ['group-4', 'group-5', 'group-6'], // These share the third orbit
  ]}
/>
```

### Item Value and Size

The `value` property of each item determines its size. Items with larger values appear larger in the visualization. The component automatically scales items proportionally within a reasonable range.

### Glow Effect

Set `glow: true` on items to add a visual glow effect:

```typescript
{
  id: 'important-item',
  label: 'Important',
  value: 100,
  glow: true,  // Adds glow effect
  color: '#6366f1',
}
```

## Styling

The component uses inline styles for maximum flexibility. You can override styles using the `style` prop:

```tsx
<RadialOrbit
  data={myData}
  style={{
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  }}
/>
```

## Performance Considerations

- The component uses React hooks (`useState`, `useMemo`) for efficient rendering
- Items are memoized to prevent unnecessary re-renders
- Large datasets (100+ items) may experience performance degradation; consider pagination or filtering
- Custom renderers should be optimized to avoid expensive operations

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires SVG and CSS clip-path support
- React 16.8+ (hooks support required)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
