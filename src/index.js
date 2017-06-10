import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Textarea from 'react-textarea-autosize';

import ToolbarController from './toolbar_controller';

const insert = (value, selection, actionData) => {
  const mtc = new ToolbarController();
  const newValue = mtc.render(actionData, selection.start, selection.end, value);
  const newSelection = { start: mtc.selectionStart, end: mtc.selectionEnd };

  return { newValue, newSelection };
};

export default class extends Component {
  static propTypes = {
    initialValue: PropTypes.string,
    render: PropTypes.func.isRequired,
    actions: PropTypes.arrayOf(PropTypes.shape({
      content: PropTypes.node.isRequired,
      execute: PropTypes.func.isRequired,
    })),
    help: PropTypes.shape({
      content: PropTypes.node.isRequired,
      link: PropTypes.string.isRequired,
    }),
  }

  static defaultProps = {
    initialValue: '',
    actions: [],
    help: null,
  }

  constructor(props) {
    super(props);

    this.state = {
      writing: true,
      focused: false,
      value: this.props.initialValue,
    };
  }

  componentDidMount() {
    if (document.addEventListener) {
      document.addEventListener('click', this.handleClickOutside, true);
    }
  }

  componentWillUnmount() {
    if (document.removeEventListener) {
      document.removeEventListener('click', this.handleClickOutside, true);
    }
  }

  enableWrite = () => {
    this.setState({ writing: true });
  }

  enablePreview = () => {
    this.setState({ writing: false });
  }

  handleChange = (e) => {
    this.setState({ value: e.target.value });
  }

  handleFocus = () => {
    this.setState({ focused: true });
  }

  handleClickOutside = (e) => {
    if (this.state.focused && !this.node.contains(e.target)) {
      this.setState({ writing: true, focused: false });
    }
  }

  handleClickAction(action) {
    const { newValue, newSelection } = action.execute(this.state.value, {
      start: this.textarea.selectionStart,
      end: this.textarea.selectionEnd,
    });

    this.setState({ value: newValue }, () => {
      this.textarea.setSelectionRange(newSelection.start, newSelection.end);
      this.textarea.focus();
    });
  }

  renderToolbar() {
    const actions = this.props.actions.map((action, index) => (
      <button key={`action-${index}`} className="MarkdownTextarea-action" onClick={this.handleClickAction.bind(this, action)}>
        { action.content }
      </button>
    ));

    return (
      <div className="MarkdownTextarea-toolbar">
        <button onClick={this.enableWrite}
          className={`MarkdownTextarea-action MarkdownTextarea-action--write ${this.state.writing ? 'is-active' : ''}`}>
          Write
        </button>
        <button onClick={this.enablePreview}
          className={`MarkdownTextarea-action MarkdownTextarea-action--preview ${this.state.writing ? '' : 'is-active'}`}>
          Preview
        </button>

        { actions }

        { this.props.help &&
          <a className="MarkdownTextarea-help" href={this.props.help.link} target="_blank" rel="noopener noreferrer">
            { this.props.help.content }
          </a> }
      </div>
    );
  }

  // The reason why we set `display:none` in the textarea instead of not rendering is so
  // that if the user resizes it, it will keep the same height after the preview is toggled
  render() {
    const minHeight = this.textarea ? this.textarea.offsetHeight : null;
    const { initialValue, render, actions, help, ...textareaProps } = this.props;

    return (
      <div className={`MarkdownTextarea ${this.state.focused ? 'is-focused' : ''}`} ref={(node) => { this.node = node; }}>
        { this.state.focused && this.renderToolbar() }

        <Textarea {...textareaProps}
          inputRef={(textarea) => { this.textarea = textarea; }}
          className="MarkdownTextarea-write"
          style={{ display: this.state.writing ? 'block' : 'none' }}
          onFocus={this.handleFocus}
          onChange={this.handleChange}
          value={this.state.value}
        />

        { !this.state.writing &&
          <div className="MarkdownTextarea-preview"
            dangerouslySetInnerHTML={{ __html: this.props.render(this.state.value) }}
            style={{ minHeight }}
          /> }
      </div>
    );
  }
}

const actions = [
  {
    content: 'B',
    execute(value, selection) {
      return insert(value, selection, { prefix: '**', suffix: '**' });
    },
  }, {
    content: 'I',
    execute(value, selection) {
      return insert(value, selection, { prefix: '_', suffix: '_' });
    },
  }, {
    content: 'QUOTE',
    execute(value, selection) {
      return insert(value, selection, { prefix: '> ' });
    },
  }, {
    content: 'URL',
    execute(value, selection) {
      return insert(value, selection, { prefix: '[', suffix: '](url)' });
    },
  }, {
    content: 'UL',
    execute(value, selection) {
      return insert(value, selection, { prefix: '- ', multiline: true });
    },
  }, {
    content: 'OL',
    execute(value, selection) {
      return insert(value, selection, { prefix: '1. ', multiline: true });
    },
  },
];

const help = {
  content: 'Markdown styling is supported',
  link: 'http://commonmark.org/help/',
};

export {
  insert,
  actions,
  help,
};
