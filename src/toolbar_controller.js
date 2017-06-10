/* eslint-disable no-param-reassign */
/* eslint-disable prefer-template */

/* Handles the logic for modifying markdown text, such as adding ** for bold.
 * This code is based on: https://git.io/vQ6Bz
 * Including the entire package would add new dependencies, such as CommonMark. */
export default class {
  constructor() {
    this.prefixLength = null;
    this.selectionStart = null;
    this.selectionEnd = null;
  }

  makeOrderedList(text) {
    const lines = text.split(/\r?\n|↵/);
    let i;
    for (i = 0; i < lines.length; i += 1) {
      lines[i] = (i + 1) + '. ' + lines[i];
      if (i > 0) {
        lines[i] = '\n' + lines[i];
      }
    }
    return lines.join('');
  }

  render(d, selectionStart, selectionEnd, text) {
    if (d.prefix) {
      text = this.renderPrefix(selectionStart, selectionEnd, d, text);
    }
    if (d.suffix) {
      text = this.renderSuffix(selectionStart, selectionEnd, this.prefixLength, d, text);
    }
    if (d.multiline) {
      this.selectionStart = 0;
      this.selectionEnd = 0;
    } else {
      this.selectionStart = selectionStart + this.prefixLength;
      this.selectionEnd = selectionEnd + this.prefixLength;
    }
    return text;
  }

  renderPrefix(selectionStart, selectionEnd, d, text) {
    this.prefixLength = d.prefix.length;
    let s;

    if (d.multiline) {
      const before = text.substring(0, selectionStart);
      let snippet = text.substring(selectionStart, selectionEnd);
      const after = text.substring(selectionEnd, text.length);

      if (d.prefix === '1. ') {
        snippet = this.makeOrderedList(snippet);
      } else {
        snippet = snippet.replace(/^/, d.prefix);
        snippet = snippet.replace(/\n/g, '\n' + d.prefix);
      }
      s = before + snippet + after;
    } else {
      s = text.substring(0, selectionStart);
      s += d.prefix;
      s += text.substring(selectionStart, text.length);
    }
    return s;
  }

  renderSuffix(selectionStart, selectionEnd, prefixLength, d, text) {
    selectionEnd += prefixLength;
    let s = text.substring(0, selectionEnd);
    s += d.suffix;
    s += text.substring(selectionEnd, text.length);
    return s;
  }
}
