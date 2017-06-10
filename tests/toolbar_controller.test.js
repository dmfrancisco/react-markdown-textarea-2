/* eslint-env jest */

/* Tests adapted from: https://git.io/vHPOB */
import MarkdownToolbar from '../src/toolbar_controller';

it('should render prefixes correctly', () => {
  const text = 'abcdefg';
  const data = {
    prefix: '**',
  };
  const rendered = '**abcdefg';
  const c = new MarkdownToolbar();

  expect(c.renderPrefix(0, 7, data, text)).toEqual(rendered);
});

it('should render suffixes correctly', () => {
  const text = 'abcdefg';
  const data = {
    suffix: '**',
  };
  const rendered = 'abcdefg**';
  const c = new MarkdownToolbar();

  expect(c.renderSuffix(0, 7, 2, data, text)).toEqual(rendered);
});

it('should render block prefixes correctly', () => {
  const text = 'abcc';
  const data = {
    blockPrefix: '```',
  };
  const rendered = '```\nabcc';
  const c = new MarkdownToolbar();

  expect(c.renderBlockPrefix(0, 0, data, text)).toEqual(rendered);
});

it('should render block suffixes correctly', () => {
  const text = 'abcc';
  const data = {
    blockSuffix: '```',
  };
  const rendered = 'abcc\n```';
  const c = new MarkdownToolbar();

  expect(c.renderBlockSuffix(0, 0, 3, data, text)).toEqual(rendered);
});

it('should render bold selections correctly', () => {
  let text = 'abcdef';
  const data = {
    prefix: '**',
    suffix: '**',
  };
  let rendered = 'abcdef****';
  let c = new MarkdownToolbar();
  expect(c.render(data, 6, 6, text)).toEqual(rendered);
  expect(c.selectionStart).toEqual(8);
  expect(c.selectionEnd).toEqual(8);

  text = 'abcdef';
  rendered = '**abcdef**';
  c = new MarkdownToolbar();
  expect(c.render(data, 0, 6, text)).toEqual(rendered);
  expect(c.selectionStart).toEqual(2);
  expect(c.selectionEnd).toEqual(8);

  text = 'abcdef\nabcdef\n';
  rendered = '**abcdef**\nabcdef\n';
  c = new MarkdownToolbar();
  expect(c.render(data, 0, 6, text)).toEqual(rendered);
  expect(c.selectionStart).toEqual(2);
  expect(c.selectionEnd).toEqual(8);

  text = 'abcdef\nabcdef\n';
  rendered = '**abcdef\nabcdef**\n';
  c = new MarkdownToolbar();
  expect(c.render(data, 0, 13, text)).toEqual(rendered);
  expect(c.selectionStart).toEqual(2);
  expect(c.selectionEnd).toEqual(15);
});

it('should render code selections correctly', () => {
  let text = 'abcdef';
  const data = {
    prefix: '`',
    suffix: '`',
    blockPrefix: '```',
    blockSuffix: '```',
  };
  let rendered = 'abcdef``';
  let c = new MarkdownToolbar();
  expect(c.render(data, 6, 6, text)).toEqual(rendered);
  expect(c.selectionStart).toEqual(7);
  expect(c.selectionEnd).toEqual(7);

  text = 'abcdef';
  rendered = '`abcdef`';
  c = new MarkdownToolbar();
  expect(c.render(data, 0, 6, text)).toEqual(rendered);
  expect(c.selectionStart).toEqual(1);
  expect(c.selectionEnd).toEqual(7);

  text = 'abcdef\nabcdef\n';
  rendered = '`abcdef`\nabcdef\n';
  c = new MarkdownToolbar();
  expect(c.render(data, 0, 6, text)).toEqual(rendered);
  expect(c.selectionStart).toEqual(1);
  expect(c.selectionEnd).toEqual(7);

  text = 'abcdef\nabcdef\n';
  rendered = '```\nabcdef\nabcdef\n\n```';
  c = new MarkdownToolbar();
  expect(c.render(data, 0, 13, text)).toEqual(rendered);
  expect(c.selectionStart).toEqual(4);
  expect(c.selectionEnd).toEqual(17);
});

it('should render ul lists correctly', () => {
  let text = 'abcdef';
  const data = {
    prefix: '- ',
    multiline: true,
  };
  let rendered = 'abcdef- ';
  let c = new MarkdownToolbar();
  expect(c.render(data, text.length, text.length, text)).toEqual(rendered);
  expect(c.selectionStart).toEqual(0);
  expect(c.selectionEnd).toEqual(0);

  text = 'abcdef';
  rendered = '- abcdef';
  c = new MarkdownToolbar();
  expect(c.render(data, 0, text.length, text)).toEqual(rendered);
  expect(c.selectionStart).toEqual(0);
  expect(c.selectionEnd).toEqual(0);

  text = 'abcdef\nabcdef';
  rendered = '- abcdef\n- abcdef';
  c = new MarkdownToolbar();
  expect(c.render(data, 0, 13, text)).toEqual(rendered);
  expect(c.selectionStart).toEqual(0);
  expect(c.selectionEnd).toEqual(0);

  text = 'abcdef\nabcdef\n';
  rendered = '- abcdef\n- abcdef\n- ';
  c = new MarkdownToolbar();
  expect(c.render(data, 0, text.length, text)).toEqual(rendered);
  expect(c.selectionStart).toEqual(0);
  expect(c.selectionEnd).toEqual(0);

  text = 'abcd\nabcd\nabc';
  rendered = '- abcd\n- abcd\n- abc';
  c = new MarkdownToolbar();
  expect(c.render(data, 0, text.length, text)).toEqual(rendered);
  expect(c.selectionStart).toEqual(0);
  expect(c.selectionEnd).toEqual(0);
});

it('should render ol lists correctly', () => {
  let text = 'abcdef';
  const data = {
    prefix: '1. ',
    multiline: true,
  };
  let rendered = 'abcdef1. ';
  let c = new MarkdownToolbar();
  expect(c.render(data, text.length, text.length, text)).toEqual(rendered);
  expect(c.selectionStart).toEqual(0);
  expect(c.selectionEnd).toEqual(0);

  text = 'abcdef';
  rendered = '1. abcdef';
  c = new MarkdownToolbar();
  expect(c.render(data, 0, text.length, text)).toEqual(rendered);
  expect(c.selectionStart).toEqual(0);
  expect(c.selectionEnd).toEqual(0);

  text = 'abcdef\nabcdef';
  rendered = '1. abcdef\n2. abcdef';
  c = new MarkdownToolbar();
  expect(c.render(data, 0, 13, text)).toEqual(rendered);
  expect(c.selectionStart).toEqual(0);
  expect(c.selectionEnd).toEqual(0);

  text = 'abcdef\nabcdef\n';
  rendered = '1. abcdef\n2. abcdef\n3. ';
  c = new MarkdownToolbar();
  expect(c.render(data, 0, text.length, text)).toEqual(rendered);
  expect(c.selectionStart).toEqual(0);
  expect(c.selectionEnd).toEqual(0);

  text = 'abcd\nabcd\nabc';
  rendered = '1. abcd\n2. abcd\n3. abc';
  c = new MarkdownToolbar();
  expect(c.render(data, 0, text.length, text)).toEqual(rendered);
  expect(c.selectionStart).toEqual(0);
  expect(c.selectionEnd).toEqual(0);
});
