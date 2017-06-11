import React from 'react';
import { storiesOf } from '@storybook/react';

import MarkdownIt from 'markdown-it';
import 'primer-tooltips/index.scss';

import MarkdownTextarea, { actions, help, renderIcon, insert } from '../src/with_octicons';
import '../src/index.scss';

const markdown = new MarkdownIt();

const stories = storiesOf('MarkdownTextarea', module);

stories.add('default', () => (
  <MarkdownTextarea
    render={value => markdown.render(value)}
    actions={actions}
    help={help}
  />
));

const customActions = actions.concat([
  {
    type: 'delimiter',
  }, {
    content: renderIcon('code'),
    props: { 'aria-label': 'Insert code' },
    execute(state, selection) {
      return insert(state, selection, {
        prefix: '`',
        suffix: '`',
        blockPrefix: '```',
        blockSuffix: '```',
      });
    },
  }, {
    content: renderIcon('file-media'),
    props: { 'aria-label': 'Insert a picture' },
    execute(state, selection) {
      return insert(state, selection, {
        key: 'image',
        prefix: '![',
        suffix: '](src)',
      });
    },
  },
]);

stories.add('custom actions', () => (
  <MarkdownTextarea
    render={value => markdown.render(value)}
    actions={customActions}
    help={help}
  />
));
