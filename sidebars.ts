import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Welcome',
    },
    {
      type: 'category',
      label: 'Runbeam Cloud',
      items: [
        'runbeam/overview',
      ],
    },
    {
      type: 'category',
      label: 'Concepts',
      items: [
        'concepts/authentication',
      ],
    },
  ],
};

export default sidebars;
