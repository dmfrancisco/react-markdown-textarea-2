
import React from 'react';
import octicons from 'octicons';

import MarkdownTextarea, { actions, insert } from '../src';

const renderIcon = (name, options = { class: 'MarkdownTextarea-icon' }) => (
  <span dangerouslySetInnerHTML={{ __html: octicons[name].toSVG(options) }} />
);

const actionsWithOcticons = []
  .concat([{ ...actions[0], content: renderIcon('bold') }])
  .concat([{ ...actions[1], content: renderIcon('italic') }])
  .concat([{ ...actions[2], content: renderIcon('quote') }])
  .concat([{ ...actions[3], content: renderIcon('link') }])
  .concat([{ ...actions[4], content: renderIcon('list-unordered') }])
  .concat([{ ...actions[5], content: renderIcon('list-ordered') }]);

export default MarkdownTextarea;

export {
  insert,
  renderIcon,
  actions,
  actionsWithOcticons,
};
