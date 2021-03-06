const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.s?css$/,
        include: path.resolve(__dirname, '../'),
        use: [
          { loader: 'style-loader'},
          { loader: 'css-loader'},
          {
            loader: 'sass-loader',
            options: {
              includePaths: [ path.resolve(__dirname, '../node_modules/') ]
            }
          }
        ]
      }
    ]
  }
}
