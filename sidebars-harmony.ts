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
      type: 'category',
      label: 'Components',
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'components/services',
          label: 'Services',
        },
        {
          type: 'doc',
          id: 'components/middleware',
          label: 'Middleware',
        },
        {
          type: 'doc',
          id: 'components/policies',
          label: 'Policies',
        },
        {
          type: 'doc',
          id: 'components/authentication',
          label: 'Authentication',
        },
        {
          type: 'doc',
          id: 'components/transforms',
          label: 'Transforms',
        },
      ],
    },
    {
      type: 'category',
      label: 'Deployment',
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'deployment/deployment',
          label: 'Deployment',
        },
      ],
    },

    {
      type: 'category',
      label: 'Guides',
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'guides/adding-pipelines',
          label: 'Adding Pipelines',
        },
      ],
    },
  ],
};

export default sidebars;
