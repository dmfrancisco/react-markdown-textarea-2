import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Textarea from 'react-textarea-autosize';

import ToolbarController from './toolbar_controller';

export default class extends Component {
  static propTypes = {
    value: PropTypes.string,
    render: PropTypes.func.isRequired,
    actions: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.string,
      content: PropTypes.node,
      props: PropTypes.object,
      execute: PropTypes.func,
    })),
    help: PropTypes.shape({
      content: PropTypes.node.isRequired,
      link: PropTypes.string.isRequired,
    }),
    toolbarAlwaysVisible: PropTypes.bool,
    labelWrite: PropTypes.node,
    labelPreview: PropTypes.node,
    tooltipClassName: PropTypes.string,
  }

  static defaultProps = {
    value: '',
    actions: [],
    help: null,
    toolbarAlwaysVisible: false,
    labelWrite: 'Write',
    labelPreview: 'Preview',
    tooltipClassName: '',
  }

  constructor(props) {
    super(props);

    this.state = {
      writing: true,
      focused: false,
      value: this.props.value,
    };
  }

  componentDidMount() {
    if (!this.props.toolbarAlwaysVisible && document.addEventListener) {
      document.addEventListener('click', this.handleClickOutside, true);
    }
  }

  componentWillUnmount() {
    if (!this.props.toolbarAlwaysVisible && document.removeEventListener) {
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
    const { newState, newSelection } = action.execute(this.state, {
      start: this.textarea.selectionStart,
      end: this.textarea.selectionEnd,
    });

    this.setState(newState, () => {
      this.textarea.setSelectionRange(newSelection.start, newSelection.end);
      this.textarea.focus();
    });
  }

  renderToolbar() {
    const actions = this.props.actions.map((action, index) => {
      if (action.type === 'delimiter') {
        return <div key={`delimiter-${index}`} className="MarkdownTextarea-delimiter" />;
      }
      return (
        <button key={`action-${index}`}
          {...action.props}
          className={`MarkdownTextarea-action ${this.props.tooltipClassName}`}
          onClick={this.handleClickAction.bind(this, action)}>
          { action.content }
        </button>
      );
    });

    return (
      <div className="MarkdownTextarea-toolbar">
        <button onClick={this.enableWrite}
          className={`MarkdownTextarea-action ${this.state.writing ? 'is-active' : ''}`}>
          { this.props.labelWrite }
        </button>
        <button onClick={this.enablePreview}
          className={`MarkdownTextarea-action ${this.state.writing ? '' : 'is-active'}`}>
          { this.props.labelPreview }
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
    const { render, actions, help, toolbarAlwaysVisible, labelWrite, labelPreview, tooltipClassName, ...textareaProps } = this.props;

    return (
      <div className={`MarkdownTextarea ${this.state.focused ? 'is-focused' : ''}`} ref={(node) => { this.node = node; }}>
        { (this.props.toolbarAlwaysVisible || this.state.focused) && this.renderToolbar() }

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

const insert = (state, selection, actionData) => {
  const newSelection = {};
  const newState = {};

  if (actionData.key && actionData.key === state.lastKey) {
    // If the user clicks twice in the same button, undo the action
    const diff = state.value.length - state.lastValue.length;
    newSelection.start = selection.start - (diff / 2);
    newSelection.end = selection.end - (diff / 2);
    newState.value = state.lastValue;
    newState.lastKey = null;
  } else {
    const mtc = new ToolbarController();
    newState.lastValue = state.value;
    newState.lastKey = actionData.key;
    newState.value = mtc.render(actionData, selection.start, selection.end, state.value);
    newSelection.start = mtc.selectionStart;
    newSelection.end = mtc.selectionEnd;
  }

  return { newState, newSelection };
};

const actions = [
  {
    type: 'delimiter',
  },
  {
    content: 'B',
    props: { 'aria-label': 'Add bold text' },
    execute(state, selection) {
      return insert(state, selection, { key: 'bold', prefix: '**', suffix: '**' });
    },
  }, {
    content: 'I',
    props: { 'aria-label': 'Add italic text' },
    execute(state, selection) {
      return insert(state, selection, { key: 'italic', prefix: '_', suffix: '_' });
    },
  }, {
    content: 'QUOTE',
    props: { 'aria-label': 'Insert a quote' },
    execute(state, selection) {
      return insert(state, selection, { prefix: '> ', multiline: true });
    },
  }, {
    content: 'URL',
    props: { 'aria-label': 'Add a link' },
    execute(state, selection) {
      return insert(state, selection, { key: 'url', prefix: '[', suffix: '](url)' });
    },
  }, {
    content: 'UL',
    props: { 'aria-label': 'Add a bulleted list' },
    execute(state, selection) {
      return insert(state, selection, { prefix: '- ', multiline: true });
    },
  }, {
    content: 'OL',
    props: { 'aria-label': 'Add a numbered list' },
    execute(state, selection) {
      return insert(state, selection, { prefix: '1. ', multiline: true });
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
