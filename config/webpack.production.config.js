const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const baseConfig = require('./webpack.base.config');

module.exports = (opts) => {
  const { DEVELOPMENT, SRC_PATH } = opts;
  const config = baseConfig(opts);
  const extractText = new ExtractTextPlugin({
    filename: 'style-[contenthash:10].css',
    disable: DEVELOPMENT
  });
  const uglifyJs = new webpack.optimize.UglifyJsPlugin();
  const htmlWebpack = new HTMLWebpackPlugin({
    template: path.join(SRC_PATH, 'index-template.html'),
  });
  const cssLoader = extractText.extract({
    use: [{
      loader: 'css-loader',
      options: {
        camelCase: true,
        modules: true,
      }
    }, {
      loader: 'sass-loader'
    }],
    fallback: 'style-loader'
  });

  return {
    ...config,
    mode: 'production',
    entry: config.entry,
    module: {
      rules: [
        ...config.module.rules,
        {
          test: /\.s?[ac]ss$/,
          use: cssLoader,
        },
      ]
    },
    output: {
      ...config.output,
      publicPath: '/',
      filename: 'bundle-[hash:12].js',
    },
    plugins: [
      ...config.plugins,
      extractText,
      htmlWebpack,
      uglifyJs
    ],
  };
};
