import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  cliSidebar: [
    {
      type: 'doc',
      id: 'overview',
      label: 'Overview',
    },
    {
      type: 'doc',
      id: 'commands',
      label: 'Commands Reference',
    },
    {
      type: 'doc',
      id: 'authorization',
      label: 'Authorization Guide',
    },
  ],
};

export default sidebars;
