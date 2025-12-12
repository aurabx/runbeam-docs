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
  ],
};

export default sidebars;
