import React from 'react';
import { storiesOf } from '@storybook/react';
import MarkdownIt from 'markdown-it';

import MarkdownTextarea, { actions, help } from '../src/with_octicons';
import '../src/index.scss';

const markdown = new MarkdownIt();

storiesOf('MarkdownTextarea', module)
  .add('default', () => (
    <MarkdownTextarea
      render={value => markdown.render(value)}
      actions={actions}
      help={help}
    />
  ));
