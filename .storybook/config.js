import { configure } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';

setOptions({
  name: 'Markdown Textarea 2',
  showLeftPanel: true,
  showDownPanel: true,
  downPanelInRight: true,
});

configure(() => require('../stories'), module);
