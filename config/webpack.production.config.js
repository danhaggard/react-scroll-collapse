const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const baseConfig = require('./webpack.base.config');

module.exports = (opts) => {
  const { DEVELOPMENT, DIST_PATH, SRC_PATH } = opts;
  const config = baseConfig(opts);

  const extractCss = new MiniCssExtractPlugin({
    filename: 'style-[contenthash:10].css'
  });

  const aggressiveMergingPlugin = new webpack.optimize.AggressiveMergingPlugin();
  const noEmitOnErrorsPlugin = new webpack.NoEmitOnErrorsPlugin();

  const jsLoader = {
    test: /\.(js|jsx)$/,
    include: [SRC_PATH],
    exclude: /node_modules/,
    loader: 'babel-loader'
  };

  const cssLoader = {
    test: /\.s?[ac]ss$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          // only enable hot in development
          hmr: DEVELOPMENT,
          // if hmr does not work, this is a forceful method.
          reloadAll: true
        }
      },
      {
        loader: 'css-loader',
        options: {
          camelCase: true,
          modules: true,
        }
      },
      {
        loader: 'sass-loader',
        options: {
          modules: true
        }
      }
    ],
  };

  const externals = {
    classnames: 'classnames',
    'lodash.isequal': 'lodash.isequal',
    react: 'react',
    'react-collapse': 'react-collapse',
    'react-dom': 'react-dom',
    'react-height': 'react-height',
    'react-motion': 'react-motion',
    'react-redux': 'react-redux',
    redux: 'redux',
    'redux-saga': 'redux-saga',
    reselect: 'reselect',
  };

  const resolve = {
    extensions: ['.js', '.jsx']
  };

  return {
    ...config,
    mode: 'production',
    entry: SRC_PATH,
    externals,
    module: {
      rules: [
        ...config.module.rules,
        jsLoader,
        cssLoader,
      ]
    },
    output: {
      path: DIST_PATH,
      filename: 'index.js',
      libraryTarget: 'umd',
      library: 'ReactScrollCollapse'
    },
    plugins: [
      ...config.plugins,
      aggressiveMergingPlugin,
      extractCss,
      noEmitOnErrorsPlugin,
    ],
    resolve,
  };
};
