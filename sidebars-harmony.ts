import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  harmonySidebar: [
    {
      type: 'doc',
      id: 'overview',
      label: 'Overview',
    },
    {
      type: 'doc',
      id: 'quickstart',
      label: 'Quick Start',
    },
    {
      type: 'doc',
      id: 'installation',
      label: 'Installation',
    },
    {
      type: 'category',
      label: 'Configuration',
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'configuration/index',
          label: 'Overview',
        },
        {
          type: 'doc',
          id: 'configuration/system',
          label: 'System',
        },
        {
          type: 'doc',
          id: 'configuration/pipelines',
          label: 'Pipelines',
        },
      ],
    },
    {
      type: 'doc',
      id: 'services',
      label: 'Services',
    },
    {
      type: 'doc',
      id: 'middleware',
      label: 'Middleware',
    },
    {
      type: 'doc',
      id: 'policies',
      label: 'Policies',
    },
    {
      type: 'doc',
      id: 'authentication',
      label: 'Authentication',
    },
    {
      type: 'doc',
      id: 'transforms',
      label: 'Transforms',
    },
    {
      type: 'doc',
      id: 'deployment',
      label: 'Deployment',
    },
  ],
};

export default sidebars;
