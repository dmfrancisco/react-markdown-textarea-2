import React from 'react';
import { shallow } from 'enzyme';
import MarkdownIt from 'markdown-it';

import MarkdownTextarea from '../src';

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
