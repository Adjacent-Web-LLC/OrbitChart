import { type RadialOrbitData } from '../types/radial-orbit';

export const companySpendData: RadialOrbitData = {
  center: {
    id: 'acme-corp',
    label: 'ACME Corp',
    subtitle: 'Total Spend: $2.4M',
  },
  groups: [
    {
      id: 'infrastructure',
      label: 'Infrastructure',
      color: '#3b82f6',
      items: [
        {
          id: 'aws-spend',
          label: 'AWS',
          value: 850000, // $850k - largest spend
          color: '#f97316',
          glow: true,
          iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1200px-Amazon_Web_Services_Logo.svg.png',
          meta: { amount: '$850k', percentage: 35 },
        },
        {
          id: 'datadog-spend',
          label: 'Datadog',
          value: 120000, // $120k
          color: '#8b5cf6',
          iconUrl: 'https://logo.clearbit.com/datadoghq.com',
          meta: { amount: '$120k', percentage: 5 },
        },
        {
          id: 'vercel-spend',
          label: 'Vercel',
          value: 45000, // $45k
          color: '#06b6d4',
          iconUrl: 'https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png',
          meta: { amount: '$45k', percentage: 2 },
        },
        {
          id: 'cloudflare-spend',
          label: 'Cloudflare',
          value: 28000, // $28k
          color: '#f97316',
          iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Cloudflare_Logo.svg/1200px-Cloudflare_Logo.svg.png',
          meta: { amount: '$28k', percentage: 1 },
        },
      ],
    },
    {
      id: 'software-tools',
      label: 'Software & Tools',
      color: '#10b981',
      items: [
        {
          id: 'github-spend',
          label: 'GitHub',
          value: 180000, // $180k
          color: '#f97316',
          glow: true,
          iconUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
          meta: { amount: '$180k', percentage: 7.5 },
        },
        {
          id: 'slack-spend',
          label: 'Slack',
          value: 95000, // $95k
          color: '#ec4899',
          glow: true,
          iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Slack_Technologies_Logo.svg/1200px-Slack_Technologies_Logo.svg.png',
          meta: { amount: '$95k', percentage: 4 },
        },
        {
          id: 'jira-spend',
          label: 'Jira',
          value: 75000, // $75k
          color: '#3b82f6',
          iconUrl: 'https://logo.clearbit.com/atlassian.com',
          meta: { amount: '$75k', percentage: 3 },
        },
        {
          id: 'figma-spend',
          label: 'Figma',
          value: 125000, // $125k
          color: '#a855f7',
          glow: true,
          iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Figma-logo.svg/1200px-Figma-logo.svg.png',
          meta: { amount: '$125k', percentage: 5 },
        },
        {
          id: 'notion-spend',
          label: 'Notion',
          value: 55000, // $55k
          color: '#f59e0b',
          iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Notion-logo.svg/1200px-Notion-logo.svg.png',
          meta: { amount: '$55k', percentage: 2.3 },
        },
        {
          id: 'linear-spend',
          label: 'Linear',
          value: 42000, // $42k
          color: '#6366f1',
          iconUrl: 'https://linear.app/favicon.ico',
          meta: { amount: '$42k', percentage: 1.8 },
        },
      ],
    },
    {
      id: 'marketing',
      label: 'Marketing',
      color: '#eab308',
      items: [
        {
          id: 'google-ads-spend',
          label: 'Google Ads',
          value: 320000, // $320k - second largest
          color: '#4285f4',
          glow: true,
          iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png',
          meta: { amount: '$320k', percentage: 13 },
        },
        {
          id: 'hubspot-spend',
          label: 'HubSpot',
          value: 85000, // $85k
          color: '#ff7a59',
          iconUrl: 'https://logo.clearbit.com/hubspot.com',
          meta: { amount: '$85k', percentage: 3.5 },
        },
        {
          id: 'mailchimp-spend',
          label: 'Mailchimp',
          value: 48000, // $48k
          color: '#ffe01b',
          iconUrl: 'https://logo.clearbit.com/mailchimp.com',
          meta: { amount: '$48k', percentage: 2 },
        },
        {
          id: 'linkedin-ads-spend',
          label: 'LinkedIn Ads',
          value: 95000, // $95k
          color: '#0077b5',
          iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/1200px-LinkedIn_logo_initials.png',
          meta: { amount: '$95k', percentage: 4 },
        },
      ],
    },
    {
      id: 'hr-payroll',
      label: 'HR & Payroll',
      color: '#ef4444',
      items: [
        {
          id: 'bamboo-spend',
          label: 'BambooHR',
          value: 65000, // $65k
          color: '#10b981',
          iconUrl: 'https://logo.clearbit.com/bamboohr.com',
          meta: { amount: '$65k', percentage: 2.7 },
        },
        {
          id: 'gusto-spend',
          label: 'Gusto',
          value: 42000, // $42k
          color: '#00d4aa',
          iconUrl: 'https://logo.clearbit.com/gusto.com',
          meta: { amount: '$42k', percentage: 1.8 },
        },
        {
          id: 'lattice-spend',
          label: 'Lattice',
          value: 38000, // $38k
          color: '#6366f1',
          iconUrl: 'https://logo.clearbit.com/lattice.com',
          meta: { amount: '$38k', percentage: 1.6 },
        },
      ],
    },
    {
      id: 'finance',
      label: 'Finance',
      color: '#10b981',
      items: [
        {
          id: 'stripe-spend',
          label: 'Stripe',
          value: 150000, // $150k - transaction fees
          color: '#6366f1',
          glow: true,
          iconUrl: 'https://logo.clearbit.com/stripe.com',
          meta: { amount: '$150k', percentage: 6 },
        },
        {
          id: 'quickbooks-spend',
          label: 'QuickBooks',
          value: 35000, // $35k
          color: '#10b981',
          iconUrl: 'https://logo.clearbit.com/quickbooks.intuit.com',
          meta: { amount: '$35k', percentage: 1.5 },
        },
        {
          id: 'bill-com-spend',
          label: 'Bill.com',
          value: 28000, // $28k
          color: '#3b82f6',
          iconUrl: 'https://logo.clearbit.com/bill.com',
          meta: { amount: '$28k', percentage: 1.2 },
        },
      ],
    },
  ],
};

