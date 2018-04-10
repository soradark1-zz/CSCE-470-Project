const common = require('./webpack.common.js');
const merge = require('webpack-merge');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'build/');

module.exports = merge(common, {
  devtool: '#eval-source-map',
  devServer: {
    contentBase: BUILD_DIR,
    hot: true,
    historyApiFallback: true
  }
});
