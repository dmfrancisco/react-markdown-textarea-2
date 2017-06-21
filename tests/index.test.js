import React from 'react';
import { shallow } from 'enzyme';
import MarkdownIt from 'markdown-it';

import MarkdownTextarea, { actions, insert } from '../src';

const markdown = new MarkdownIt();

it('renders correctly with only required props', () => {
  const element = shallow(
    <MarkdownTextarea
      render={value => markdown.render(value)}
    />
  );
  expect(element.getNodes()).toMatchSnapshot();
});

it('displays toolbar on focus', () => {
  const element = shallow(
    <MarkdownTextarea
      render={value => markdown.render(value)}
    />
  );
  element.find('.MarkdownTextarea-write').simulate('focus');
  expect(element.getNodes()).toMatchSnapshot();
});

it('supports preview', () => {
  const element = shallow(
    <MarkdownTextarea
      value="Hello _World_"
      render={value => markdown.render(value)}
    />
  );
  element.find('.MarkdownTextarea-write').simulate('focus');
  element.find('.MarkdownTextarea-action').at(1).simulate('click');
  expect(element.getNodes()).toMatchSnapshot();
});

it('supports custom actions', () => {
  const customActions = actions.concat([{
    content: '</>',
    execute(state, selection) {
      return insert(state, selection, {
        prefix: '`',
        suffix: '`',
        blockPrefix: '```',
        blockSuffix: '```',
      });
    },
  }]);

  const element = shallow(
    <MarkdownTextarea
      render={value => markdown.render(value)}
      actions={customActions}
      toolbarAlwaysVisible
    />
  );
  expect(element.getNodes()).toMatchSnapshot();
});

it('accepts regular textarea attributes', () => {
  const element = shallow(
    <MarkdownTextarea
      id="example"
      name="example"
      render={value => value}
      placeholder="Example placeholder"
      value="Hello, World"
      disabled
      readOnly
      required
      maxLength={7}
      autoFocus
    />
  );
  expect(element.getNodes()).toMatchSnapshot();
});
