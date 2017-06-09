import React from 'react';
import { storiesOf } from '@storybook/react';

import MarkdownTextarea from '../src';

storiesOf('MarkdownTextarea', module)
  .add('without props', () => (
    <MarkdownTextarea />
  ));
