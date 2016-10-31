import path from 'path';
import webpack from 'webpack';
import baseConfig from './base';

const testConfig = (opts) => {
  const {PROJECT_ROOT} = opts;
  const config = baseConfig(opts);
  const npmPath = path.join(PROJECT_ROOT, '../../node_modules');
  const getIncludedPackages = () => [].map(pkg => path.join(npmPath, pkg));
  const includedPackages = getIncludedPackages();
  // const examplesPath = path.resolve(PROJECT_ROOT, 'examples');
  const testPath = path.resolve(PROJECT_ROOT, 'test');
  const srcPath = path.resolve(PROJECT_ROOT, 'src');
  const outputPath = path.resolve(PROJECT_ROOT, './dist/assets');
  console.log('includedPackages', includedPackages);

  const resolve = {
    extensions: ['', '.js', '.jsx']
  };
  return {
    ...config,
    devtool: 'inline-source-map',
    entry: './src',
    externals: {
      cheerio: 'window',
      'react/lib/ExecutionEnvironment': true,
      'react/addons': true,
      'react/lib/ReactContext': true,
    },
    output: {
      path: outputPath,
      filename: 'app.js',
      publicPath: './assets/'
    },

    plugins: [
      ...config.plugins,
    ],
    module: {
      preLoaders: [
        {
          test: /\.(js|jsx)$/,
          loader: 'isparta-loader',
          include: [
            srcPath,
          ]
        }
      ],
      loaders: [
        {
          test: /\.(js|jsx)$/,
          include: [...includedPackages, srcPath, testPath],
          loader: 'babel-loader',
          query: {
            presets: ['airbnb']
          },
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

export default testConfig;

/*
/**
 * Default test configuration.

const WebpackBaseConfig = require('./Base');
const webpack = require('webpack');

class WebpackTestConfig extends WebpackBaseConfig {

  constructor() {
    super();
    this.config = {
      devtool: 'inline-source-map',
      externals: {
        cheerio: 'window',
        'react/lib/ExecutionEnvironment': true,
        'react/addons': true,
        'react/lib/ReactContext': true,
      },
      module: {
        preLoaders: [
          {
            test: /\.(js|jsx)$/,
            loader: 'isparta-loader',
            include: [
              this.srcPathAbsolute
            ]
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
            loader: 'null-loader'
          },
          {
            test: /\.(sass|scss|less|styl|png|jpg|gif|mp4|ogg|svg|woff|woff2)$/,
            loader: 'null-loader'
          },
          {
            test: /\.json$/,
            loader: 'json'
          },
          {
            test: /\.(js|jsx)$/,
            loader: 'babel-loader',
            query: {
              presets: ['airbnb']
            },
            include: [].concat(
              this.includedPackages,
              [
                this.srcPathAbsolute,
                this.testPathAbsolute
              ]
            )
          }
        ]
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': '"test"'
        })
      ]
    };
  }

  /**
   * Set the config data.
   * Will remove the devServer config value as we do not need it in test environments
   * This function will always return a new config
   * @param {Object} data Keys to assign
   * @return {Object}

  set config(data) {

    const baseSettings = this.defaultSettings;
    delete baseSettings.devServer;
    this._config = Object.assign({}, baseSettings, data);
    return this._config;
  }

  /**
   * Get the global config
   * @param {Object} config Final webpack config

  get config() {
    return super.config;
  }

  /**
   * Get the environment name
   * @return {String} The current environment

  get env() {
    return 'test';
  }
}

module.exports = WebpackTestConfig;
*/
