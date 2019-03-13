const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: [
    'webpack-dev-server/client',
    'webpack/hot/only-dev-server',
    resolve(__dirname, 'hotReload'),
  ],
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname),
    publicPath: 'http://localhost:8080/',
  },
  resolve: {
    modules: [resolve(__dirname, '../app'), 'node_modules'],
  },
  context: resolve(__dirname, '../app'),
  devtool: '#eval',
  devServer: {
    hot: true,
    host: '0.0.0.0',
    contentBase: resolve(__dirname, '../static'),
    publicPath: '/',
    historyApiFallback: true,
    stats: {
      colors: true,
      hash: false,
      assets: false,
      children: false,
      timings: false,
      chunks: false,
      chunkModules: true,
      modules: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [resolve(__dirname, '../app'), resolve(__dirname)],
        use: 'babel-loader',
      },
      {
        test: /\.(scss|css)$/,
        use: [
          { loader: 'style-loader' }, // creates style nodes from JS strings
          { loader: 'css-loader' }, // translates CSS into CommonJS
          { loader: 'sass-loader' }, // compiles Sass to CSS
        ],
      },
      {
        test: /\.(woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: 'fonts/[hash].[ext]',
            limit: 5000,
            mimetype: 'application/font-woff',
          },
        },
      },
      {
        test: /\.(ttf|eot|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[hash].[ext]',
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      title: 'silica',
      template: '../webpack/template.html',
    }),
    new CopyWebpackPlugin([
            { from: '../static' },
    ]),
  ],
};
