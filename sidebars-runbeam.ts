import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  runbeamSidebar: [
    {
      type: 'doc',
      id: 'overview',
      label: 'Overview',
    },
    {
      type: 'doc',
      id: 'runbeam-authorization',
      label: 'Authorizing Gateways',
    },
    {
      type: 'doc',
      id: 'providers',
      label: 'Providers',
    },
    {
      type: 'doc',
      id: 'references',
      label: 'References',
    },
    {
      type: 'doc',
      id: 'meshes',
      label: 'Meshes',
    },
  ],
};

export default sidebars;
