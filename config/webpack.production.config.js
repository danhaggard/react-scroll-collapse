const baseConfig = require('./webpack.base.config');

module.exports = (opts) => {
  const { DEVELOPMENT, DIST_PATH, SRC_PATH } = opts;
  const config = baseConfig(opts);

  const cssIdentifier = '[path][name]---[local]';

  const jsLoader = {
    test: /\.(js|jsx)$/,
    include: [SRC_PATH],
    exclude: /node_modules/,
    loader: require.resolve('babel-loader'),
  };

  const cssLoader = {
    test: /\.s?[ac]ss$/,
    use: [
      {
        loader: require.resolve('style-loader'),
      },
      {
        loader: require.resolve('css-loader'),
        options: {
          // Turns on CSS modules.
          modules: {
            mode: 'global',
            // This setting allows the use of hyphen in css class names in css
            // modules.  It gets converted into camel case when exported as the
            // object property name when the style is imported as a JS object.
            localIdentName: cssIdentifier,
            exportLocalsConvention: 'camelCase',
          },
          sourceMap: DEVELOPMENT,
        },
      },
      {
        loader: require.resolve('sass-loader'),
        options: {
          sassOptions: {
            localIdentName: cssIdentifier,
            sourceMap: DEVELOPMENT,
            modules: true,
          },
        },
      },
    ],
  };

  const externals = {
    classnames: 'classnames',
    react: 'react',
    'react-collapse': 'react-collapse',
    'react-dom': 'react-dom',
    'react-height': 'react-height',
    'react-motion': 'react-motion',
    'react-redux': 'react-redux',
    redux: 'redux',
  };

  const resolve = {
    extensions: ['.js', '.jsx'],
  };

  return {
    ...config,
    mode: 'production',
    entry: SRC_PATH,
    externals,
    module: {
      rules: [...config.module.rules, jsLoader, cssLoader],
    },
    output: {
      path: DIST_PATH,
      filename: 'index.js',
      libraryTarget: 'umd',
      library: 'ReactScrollCollapse',
    },
    plugins: [...config.plugins],
    resolve,
  };
};
