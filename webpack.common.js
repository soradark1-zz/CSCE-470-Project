const path = require('path');
const webpack = require('webpack');

const APP_DIR = path.resolve(__dirname, 'app/');
const BUILD_DIR = path.resolve(__dirname, 'dist/');

module.exports = {
  entry: `${APP_DIR}/index.jsx`,

  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },

  node: {
    fs: 'empty'
  },

  devServer: {
    historyApiFallback: true,
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(css|scss)$/,
        use: [
          { 'loader': 'style-loader' },
          { 'loader': 'css-loader' },
          { 'loader': 'sass-loader' }
        ]
      },
      {
        test: /\.(svg|png|gif|jpg)$/,
        loader: 'file-loader'
      },
      {
        test: /\.html$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      }
    ]
  }
};
