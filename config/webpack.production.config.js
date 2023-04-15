const baseConfig = require('./webpack.base.config');


module.exports = (opts) => {
  const { DEVELOPMENT, DIST_PATH, SRC_PATH } = opts;
  const config = baseConfig(opts);

  const cssIdentifier = '[path][name]---[local]';

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
        loader: 'style-loader',
        options: {
          sourceMap: DEVELOPMENT
        }
      },
      {
        loader: 'css-loader',
        options: {
          camelCase: true,
          localIdentName: cssIdentifier,
          modules: true,
        }
      },
      {
        loader: 'sass-loader',
        options: {
          sassOptions: {
            localIdentName: cssIdentifier,
            modules: true
          }
        }
      }
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
    ],
    resolve,
  };
};
