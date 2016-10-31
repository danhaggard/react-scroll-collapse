import path from 'path';
import webpack from 'webpack';
import baseConfig from './base';

module.exports = (opts) => {
  const {PROJECT_ROOT} = opts;
  const config = baseConfig(opts);
  const examplesPath = path.resolve(PROJECT_ROOT, 'examples');
  const bundlesPath = path.resolve(examplesPath, 'bundles');
  const srcPath = path.resolve(PROJECT_ROOT, 'src');
  const resolve = {
    extensions: ['', '.js', '.jsx']
  };
  return {
    ...config,
    devtool: 'eval-source-map',
    entry: './examples',
    output: {
      path: bundlesPath,
      filename: 'app.js',
      publicPath: './bundles/'
    },
    devServer: {
      contentBase: './examples/',
      publicPath: '/bundles/',
      historyApiFallback: true,
      hot: true,
      inline: true,
      stats: 'errors-only',
      host: process.env.HOST,
      port: process.env.PORT
    },
    plugins: [
      ...config.plugins,
      new webpack.HotModuleReplacementPlugin({
        multiStep: true
      })
    ],
    module: {
      preLoaders: [
        {
          test: /\.(js|jsx)$/,
          include: [examplesPath,
            srcPath],
          exclude: /node_modules/,
          loader: 'eslint'
        }
      ],
      loaders: [
        {
          test: /\.(js|jsx)$/,
          include: [examplesPath, srcPath],
          exclude: /node_modules/,
          loader: 'babel'
        },
        {
          test: /\.scss$/,
          loaders: [
            'style',
            'css?sourceMap&localIdentName=[path][name]---[local]',
            'sass?sourceMap&localIdentName=[path][name]---[local]'
          ]
        },
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader?modules&localIdentName=[path][name]---[local]'
        }
      ],
    },
    resolve,
  };
};


/**
 * Default dev server configuration.

const webpack = require('webpack');
const WebpackBaseConfig = require('./Base');

class WebpackDevConfig extends WebpackBaseConfig {

  constructor() {
    super();
    this.config = {
      devtool: 'cheap-module-source-map',
      entry: [
        'webpack-dev-server/client?http://0.0.0.0:8000/',
        'webpack/hot/only-dev-server',
        './index.js'
      ],
      plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
      ]
    };
  }
}

module.exports = WebpackDevConfig;
*/
