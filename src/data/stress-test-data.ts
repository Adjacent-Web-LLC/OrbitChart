import { type RadialOrbitData } from '../types/radial-orbit';

// Generate a stress test dataset with over 100 items
const generateStressTestItems = (count: number, groupId: string, baseValue: number = 50): RadialOrbitData['groups'][0]['items'] => {
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];
  const icons = [
    'https://logo.clearbit.com/stripe.com',
    'https://logo.clearbit.com/github.com',
    'https://logo.clearbit.com/slack.com',
    'https://logo.clearbit.com/atlassian.com',
    'https://logo.clearbit.com/vercel.com',
    'https://logo.clearbit.com/datadoghq.com',
    'https://logo.clearbit.com/aws.amazon.com',
    'https://logo.clearbit.com/microsoft.com',
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `${groupId}-item-${i + 1}`,
    label: `Item ${i + 1}`,
    value: baseValue + Math.floor(Math.random() * 50),
    color: colors[i % colors.length],
    glow: i % 5 === 0, // Every 5th item glows
    iconUrl: icons[i % icons.length],
    meta: {
      index: i + 1,
      category: `Category ${Math.floor(i / 10) + 1}`,
      priority: i % 3 === 0 ? 'high' : i % 3 === 1 ? 'medium' : 'low',
    },
  }));
};

export const stressTestData: RadialOrbitData = {
  center: {
    id: 'stress-test-center',
    label: 'Stress Test',
    subtitle: '100+ Items',
  },
  groups: [
    {
      id: 'group-1',
      label: 'Group A',
      color: '#6366f1',
      items: generateStressTestItems(35, 'group-1', 60),
    },
    {
      id: 'group-2',
      label: 'Group B',
      color: '#10b981',
      items: generateStressTestItems(30, 'group-2', 55),
    },
    {
      id: 'group-3',
      label: 'Group C',
      color: '#f59e0b',
      items: generateStressTestItems(25, 'group-3', 50),
    },
    {
      id: 'group-4',
      label: 'Group D',
      color: '#ef4444',
      items: generateStressTestItems(20, 'group-4', 45),
    },
    {
      id: 'group-5',
      label: 'Group E',
      color: '#8b5cf6',
      items: generateStressTestItems(15, 'group-5', 40),
    },
  ],
};

