const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

const extractSass = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',
  allChunks: true,
});

module.exports = {
  entry: {
    main: resolve(__dirname, '../app'),
    vendor: [
      'react',
      'react-code-splitting',
      'react-dom',
      'react-helmet',
      'react-redux',
      'react-router-dom',
      'redux',
      'redux-thunk',
    ],
  },
  resolve: {
    modules: [resolve(__dirname, '../app'), 'node_modules'],
  },
  devtool: '#source-map',
  output: {
    filename: '[name].[chunkhash].js',
    path: resolve(__dirname, '../dist'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [resolve(__dirname, '../app')],
        use: 'babel-loader',
      },
      {
        test: /\.(scss|css)$/,
        use: extractSass.extract({
          use: [
            { loader: 'css-loader', options: { minimize: true } },
            { loader: 'sass-loader' },
          ],
        }),
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
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    extractSass,
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
        screw_ie8: true,
        unused: true,
        dead_code: true,
      },
      sourceMap: true,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'],
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      title: 'Gobo',
      template: 'webpack/template.html',
    }),
  // new SWPrecacheWebpackPlugin({
  //   cacheId: 'Gobo',
  //   filename: 'service-worker.js', // This name is referenced in manageServiceWorker.js
  //   maximumFileSizeToCacheInBytes: 4194304,
  //   minify: true,
  //   navigateFallback: '/index.html',
  //   staticFileGlobs: [
  //     'static/**.*',
  //     'static/images/**.*',
  //   ],
  //   stripPrefix: 'static/',
  //   mergeStaticsConfig: true, // Merge webpacks static outputs with the globs described above.
  //   // runtimeCaching: [{
         //    //   urlPattern: /^https:\/\/api\.github\.com\//,
         //    //   handler: 'fastest',
         //    //   networkTimeoutSeconds: 5000,
         //    //   options: {
         //    //     cache: {
         //    //       maxEntries: 10,
         //    //       name: 'github-api-cache'
         //    //     }
         //    //   }
         //    // }]
  // }),
  ],
};
