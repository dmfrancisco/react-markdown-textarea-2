/* eslint-disable */
module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'MarkdownTextarea',
      externals: {
        react: 'React'
      }
    }
  }
}
