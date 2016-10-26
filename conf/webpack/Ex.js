'use strict';

/**
 * Examples server configuration.
 */

const path = require('path');

const webpack = require('webpack');
const WebpackBaseConfig = require('./Base');

class WebpackExConfig extends WebpackBaseConfig {

  constructor() {
    super();

    this.config = {
      context: this.examplesPathAbsolute,
      devtool: 'cheap-module-source-map',
      devServer: {
        contentBase: './examples/',
        publicPath: '/assets/',
        historyApiFallback: true,
        hot: true,
        inline: true,
        port: 8000
      },
      entry: [
        'webpack-dev-server/client?http://0.0.0.0:8000/',
        'webpack/hot/only-dev-server',
        './index.js'
      ],
      module: {
        preLoaders: [
          {
            test: /\.(js|jsx)$/,
            include: this.examplesPathAbsolute,
            loader: 'eslint'
          }
        ],
        loaders: [
          {
            test: /\.cssmodule\.css$/,
            loaders: [
              'style',
              'css?modules&importLoaders=1&localIdentName=[name]-[local]-[hash:base64:5]'
            ]
          },
          {
            test: /^.((?!cssmodule).)*\.css$/,
            loaders: [
              'style',
              'css'
            ]
          },
          {
            test: /\.cssmodule\.(sass|scss)$/,
            loaders: [
              'style',
              'css?modules&importLoaders=1&localIdentName=[name]-[local]-[hash:base64:5]',
              'sass'
            ]
          },
          {
            test: /^.((?!cssmodule).)*\.(sass|scss)$/,
            loaders: [
              'style',
              'css',
              'sass'
            ]
          },
          {
            test: /\.cssmodule\.less$/,
            loaders: [
              'style',
              'css?modules&importLoaders=1&localIdentName=[name]-[local]-[hash:base64:5]',
              'less'
            ]
          },
          {
            test: /^.((?!cssmodule).)*\.less$/,
            loaders: [
              'style',
              'css',
              'less'
            ]
          },
          {
            test: /\.cssmodule\.styl$/,
            loaders: [
              'style',
              'css?modules&importLoaders=1&localIdentName=[name]-[local]-[hash:base64:5]',
              'stylus'
            ]
          },
          {
            test: /^.((?!cssmodule).)*\.styl$/,
            loaders: [
              'style',
              'css',
              'stylus'
            ]
          },
          {
            test: /\.(png|jpg|gif|mp4|ogg|svg|woff|woff2)$/,
            loaders: ['file']
          },
          {
            test: /\.json$/,
            loaders: 'json'
          },
          {
            test: /\.(js|jsx)$/,
            include: [].concat(
              this.includedPackages,
              [this.examplesPathAbsolute, this.srcPathAbsolute]
            ),
            loaders: ['react-hot', 'babel']
          }
        ]
      },
      output: {
        path: path.resolve('./dist/assets'),
        filename: 'app.js',
        publicPath: './assets/'
      },
      plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
      ],
      resolve: {
        alias: {
          actions: `${this.examplesPathAbsolute}/actions/`,
          components: `${this.examplesPathAbsolute}/components/`,
          config: `${this.examplesPathAbsolute}/config/${this.env}.js`,
          images: `${this.examplesPathAbsolute}/images/`,
          sources: `${this.examplesPathAbsolute}/sources/`,
          stores: `${this.examplesPathAbsolute}/stores/`,
          styles: `${this.examplesPathAbsolute}/styles/`
        },
        extensions: ['', '.js', '.jsx'],
        modules: [
          this.examplesPathAbsolute,
          this.srcPathAbsolute,
          'node_modules'
        ]
      }
    };
  }

  /**
   * Get the environment name
   * @return {String} The current environment
   */
  get env() {
    return 'ex';
  }

  /**
   * Set the config data.
   * Will remove the devServer config value as we do not need it in test environments
   * This function will always return a new config
   * @param {Object} data Keys to assign
   * @return {Object}
   */
  set config(data) {
    const baseSettings = this.defaultSettings;
    this._config = Object.assign({}, baseSettings, data);
    return this._config;
  }

  /**
   * Get the global config
   * @param {Object} config Final webpack config
   */
  get config() {
    return super.config;
  }

}

module.exports = WebpackExConfig;
