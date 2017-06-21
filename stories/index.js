import React from 'react';
import { storiesOf } from '@storybook/react';

import MarkdownIt from 'markdown-it';
import 'normalize.css';
import 'primer-tooltips/index.scss';
import 'github-markdown-css';

import MarkdownTextarea, { actions, help, renderIcon, insert, classNames } from '../src/with_octicons';
import '../src/index.scss';
import './custom_styles.scss';

const markdown = new MarkdownIt();

const classNamesWithPreview = Object.assign({}, classNames, {
  preview: 'MarkdownTextarea-preview markdown-body',
});

const stories = storiesOf('MarkdownTextarea', module);

const smallText = `
[Markdown](https://guides.github.com/features/mastering-markdown/) is just \
regular text with some simple symbols for formatting. **Here's a quote**:

> The idea is that a Markdown-formatted document should be publishable as-is, \
as plain text, without looking like it’s been marked up with tags or formatting \
instructions — *John Gruber*
`.trim();

stories.add('Hello World', () => (
  <MarkdownTextarea
    render={value => markdown.render(value)}
    value={smallText}
    actions={actions}
    help={help}
    classNames={classNamesWithPreview}
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

const longText = `
It's very easy to make some words **bold** and other words *italic* with Markdown. \
You can even [link to Google!](http://google.com)

Sometimes you want numbered lists:

1. One
2. Two
3. Three

Sometimes you want bullet points:

* Start a line with a star
* Profit!

Alternatively,

- Dashes work just as well
- And if you have sub points, put two spaces before the dash or star:
  - Like this
  - And this

If you want to embed images, this is how you do it:

![Image of Yaktocat](https://octodex.github.com/images/yaktocat.png)

# Structured documents

Sometimes it's useful to have different levels of headings to structure your documents. \
Start lines with a \`#\` to create headings. Multiple \`##\` in a row denote smaller heading sizes.

### This is a third-tier heading

You can use one \`#\` all the way up to \`######\` six for different heading sizes.

If you'd like to quote someone, use the > character before the line:

> Coffee. The finest organic suspension ever devised... I beat the Borg with it.
> - Captain Janeway

There are many different ways to style code with GitHub's markdown. \
If you have inline code blocks, wrap them in backticks: \`var example = true\`. \
If you've got a longer block of code, you can indent with four spaces:

    if (isAwesome) {
      return true
    }
`.trim();

stories.add('Custom actions', () => (
  <MarkdownTextarea
    render={value => markdown.render(value)}
    value={longText}
    actions={customActions}
    help={help}
    classNames={classNamesWithPreview}
  />
));

const placeholder = `
This is a custom placeholder. Most of the textarea attributes are available, such as disabled, \
readOnly, maxLength, required and autoFocus. Instead of rows, there are minRows and maxRows props.
`.trim();

stories.add('Textarea Attributes', () => (
  <MarkdownTextarea
    render={value => markdown.render(value)}
    actions={actions}
    help={help}
    classNames={classNamesWithPreview}
    placeholder={placeholder}
    minRows={10}
    maxRows={20}
    disabled
    readOnly
    maxLength={7}
    required
    autoFocus
  />
));

const classNamesWithTooltips = Object.assign({}, classNamesWithPreview, {
  action: 'MarkdownTextarea-action tooltipped tooltipped-s',
});

stories.add('With GitHub Tooltips', () => (
  <MarkdownTextarea
    render={value => markdown.render(value)}
    actions={actions}
    help={help}
    classNames={classNamesWithTooltips}
  />
));

const customClassNames = Object.assign({}, classNamesWithPreview);

Object.keys(customClassNames).forEach((key) => {
  customClassNames[key] = customClassNames[key].replace(/MarkdownTextarea/, 'CustomMarkdownTextarea');
});

stories.add('Custom Styles', () => (
  <MarkdownTextarea
    render={value => markdown.render(value)}
    actions={actions}
    help={help}
    classNames={customClassNames}
  />
));
