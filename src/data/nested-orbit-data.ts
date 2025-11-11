import { type RadialOrbitData } from '../types/radial-orbit';

export const nestedOrbitData: RadialOrbitData = {
  center: {
    id: 'solar-system',
    label: 'Solar System',
    subtitle: 'Planets',
  },
  groups: [
    {
      id: 'mercury-orbit',
      label: 'Mercury',
      color: '#3b82f6',
      items: [
        {
          id: 'mercury',
          label: 'Mercury',
          value: 38, // ~38% of Earth's diameter (4,879 km vs 12,756 km)
          iconUrl: 'https://img.icons8.com/color/96/mercury-planet.png',
          nestedData: {
            center: { id: 'mercury-center', label: 'Mercury', subtitle: 'Moons' },
            groups: [
              {
                id: 'mercury-moons',
                label: 'Mercury Moons',
                color: '#60a5fa',
                items: [
                  { id: 'no-moons', label: 'No Moons', value: 0, color: '#94a3b8' },
                ],
              },
            ],
          },
        },
      ],
    },
    {
      id: 'venus-orbit',
      label: 'Venus',
      color: '#fbbf24',
      items: [
        {
          id: 'venus',
          label: 'Venus',
          value: 95, // ~95% of Earth's diameter (12,104 km vs 12,756 km)
          iconUrl: 'https://img.icons8.com/color/96/venus-planet.png',
          nestedData: {
            center: { id: 'venus-center', label: 'Venus', subtitle: 'Moons' },
            groups: [
              {
                id: 'venus-moons',
                label: 'Venus Moons',
                color: '#fbbf24',
                items: [
                  { id: 'no-moons-venus', label: 'No Moons', value: 0, color: '#94a3b8' },
                ],
              },
            ],
          },
        },
      ],
    },
    {
      id: 'earth-orbit',
      label: 'Earth',
      color: '#34d399',
      items: [
        {
          id: 'earth',
          label: 'Earth',
          value: 100, // Baseline (12,756 km diameter)
          iconUrl: 'https://img.icons8.com/color/96/earth-planet.png',
          nestedData: {
            center: { id: 'earth-center', label: 'Earth', subtitle: 'Moons', imageUrl: 'https://img.icons8.com/color/96/earth-planet.png' },
            groups: [
              {
                id: 'earth-moons',
                label: 'Earth Moons',
                color: '#34d399',
                items: [
                  { 
                    id: 'moon', 
                    label: 'The Moon', 
                    value: 27,
                    iconUrl: 'https://img.icons8.com/color/96/moon.png',
                    color: '#cbd5e1',
                  },
                ],
              },
            ],
          },
        },
      ],
    },
    {
      id: 'mars-orbit',
      label: 'Mars',
      color: '#ef4444',
      items: [
        {
          id: 'mars',
          label: 'Mars',
          value: 53, // ~53% of Earth's diameter (6,792 km vs 12,756 km)
          iconUrl: 'https://img.icons8.com/color/96/mars-planet.png',
          nestedData: {
            center: { id: 'mars-center', label: 'Mars', subtitle: 'Moons', imageUrl: 'https://img.icons8.com/color/96/mars-planet.png' },
            groups: [
              {
                id: 'mars-moons',
                label: 'Mars Moons',
                color: '#ef4444',
                items: [
                  { 
                    id: 'phobos', 
                    label: 'Phobos', 
                    value: 8,
                    iconUrl: 'https://img.icons8.com/color/96/moon.png',
                    color: '#fca5a5',
                  },
                  { 
                    id: 'deimos', 
                    label: 'Deimos', 
                    value: 30,
                    iconUrl: 'https://img.icons8.com/color/96/moon.png',
                    color: '#f87171',
                  },
                ],
              },
            ],
          },
        },
      ],
    },
    {
      id: 'jupiter-orbit',
      label: 'Jupiter',
      color: '#a78bfa',
      items: [
        {
          id: 'jupiter',
          label: 'Jupiter',
          value: 1121, // ~11.2x Earth's diameter (142,984 km vs 12,756 km)
          iconUrl: 'https://img.icons8.com/color/96/jupiter-planet.png',
          nestedData: {
            center: { id: 'jupiter-center', label: 'Jupiter', subtitle: 'Major Moons', imageUrl: 'https://img.icons8.com/color/96/jupiter-planet.png' },
            groups: [
              {
                id: 'galilean-moons',
                label: 'Galilean Moons',
                color: '#a78bfa',
                items: [
                  { 
                    id: 'io', 
                    label: 'Io', 
                    value: 2,
                    iconUrl: 'https://img.icons8.com/color/96/moon.png',
                    color: '#fbbf24',
                  },
                  { 
                    id: 'europa', 
                    label: 'Europa', 
                    value: 4,
                    iconUrl: 'https://img.icons8.com/color/96/moon.png',
                    color: '#60a5fa',
                  },
                  { 
                    id: 'ganymede', 
                    label: 'Ganymede', 
                    value: 7,
                    iconUrl: 'https://img.icons8.com/color/96/moon.png',
                    color: '#34d399',
                  },
                  { 
                    id: 'callisto', 
                    label: 'Callisto', 
                    value: 17,
                    iconUrl: 'https://img.icons8.com/color/96/moon.png',
                    color: '#94a3b8',
                  },
                ],
              },
            ],
          },
        },
      ],
    },
    {
      id: 'saturn-orbit',
      label: 'Saturn',
      color: '#fbbf24',
      items: [
        {
          id: 'saturn',
          label: 'Saturn',
          value: 945, // ~9.45x Earth's diameter (120,536 km vs 12,756 km)
          iconUrl: 'https://img.icons8.com/color/96/saturn-planet.png',
          nestedData: {
            center: { id: 'saturn-center', label: 'Saturn', subtitle: 'Major Moons', imageUrl: 'https://img.icons8.com/color/96/saturn-planet.png' },
            groups: [
              {
                id: 'saturn-moons',
                label: 'Saturn Moons',
                color: '#fbbf24',
                items: [
                  { 
                    id: 'titan', 
                    label: 'Titan', 
                    value: 16,
                    iconUrl: 'https://img.icons8.com/color/96/moon.png',
                    color: '#facc15',
                  },
                  { 
                    id: 'enceladus', 
                    label: 'Enceladus', 
                    value: 1,
                    iconUrl: 'https://img.icons8.com/color/96/moon.png',
                    color: '#fde047',
                  },
                  { 
                    id: 'rhea', 
                    label: 'Rhea', 
                    value: 5,
                    iconUrl: 'https://img.icons8.com/color/96/moon.png',
                    color: '#fef08a',
                  },
                ],
              },
            ],
          },
        },
      ],
    },
    {
      id: 'uranus-orbit',
      label: 'Uranus',
      color: '#60a5fa',
      items: [
        {
          id: 'uranus',
          label: 'Uranus',
          value: 401, // ~4x Earth's diameter (51,118 km vs 12,756 km)
          iconUrl: 'https://img.icons8.com/color/96/uranus-planet.png',
          nestedData: {
            center: { id: 'uranus-center', label: 'Uranus', subtitle: 'Major Moons', imageUrl: 'https://img.icons8.com/color/96/uranus-planet.png' },
            groups: [
              {
                id: 'uranus-moons',
                label: 'Uranus Moons',
                color: '#60a5fa',
                items: [
                  { 
                    id: 'titania', 
                    label: 'Titania', 
                    value: 9,
                    iconUrl: 'https://img.icons8.com/color/96/moon.png',
                    color: '#93c5fd',
                  },
                  { 
                    id: 'oberon', 
                    label: 'Oberon', 
                    value: 13,
                    iconUrl: 'https://img.icons8.com/color/96/moon.png',
                    color: '#bfdbfe',
                  },
                  { 
                    id: 'umbriel', 
                    label: 'Umbriel', 
                    value: 4,
                    iconUrl: 'https://img.icons8.com/color/96/moon.png',
                    color: '#dbeafe',
                  },
                ],
              },
            ],
          },
        },
      ],
    },
    {
      id: 'neptune-orbit',
      label: 'Neptune',
      color: '#3b82f6',
      items: [
        {
          id: 'neptune',
          label: 'Neptune',
          value: 388, // ~3.88x Earth's diameter (49,528 km vs 12,756 km)
          iconUrl: 'https://img.icons8.com/color/96/neptune-planet.png',
          nestedData: {
            center: { id: 'neptune-center', label: 'Neptune', subtitle: 'Major Moons', imageUrl: 'https://img.icons8.com/color/96/neptune-planet.png' },
            groups: [
              {
                id: 'neptune-moons',
                label: 'Neptune Moons',
                color: '#3b82f6',
                items: [
                  { 
                    id: 'triton', 
                    label: 'Triton', 
                    value: 6,
                    iconUrl: 'https://img.icons8.com/color/96/moon.png',
                    color: '#60a5fa',
                  },
                  { 
                    id: 'proteus', 
                    label: 'Proteus', 
                    value: 1,
                    iconUrl: 'https://img.icons8.com/color/96/moon.png',
                    color: '#93c5fd',
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  ],
};
