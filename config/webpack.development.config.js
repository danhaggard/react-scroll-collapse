const baseConfig = require('./webpack.base.config');

module.exports = (opts) => {
  const { DEVELOPMENT, BUNDLES_PATH, EXAMPLES_PATH, SRC_PATH } = opts;
  const config = baseConfig(opts);

  const cssIdentifier = '[path][name]---[local]';

  // source map.  If too slow build times. Can try: cheap-module-eval-source-map
  // but have noticed it leaves of names of functions etc...
  const devtool = 'eval-source-map';
  // const devtool = 'cheap-module-eval-source-map';

  const entry = [
    // add in our base config entry points.  Must come after HMR
    EXAMPLES_PATH,

    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint
    'webpack-dev-server/client?http://localhost:8080',
  ];
  const cssLoader = [
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
  ];
  // Here we compose the development webpack config object using the base config
  return {
    ...config,
    mode: 'development',
    entry,
    devtool,
    module: {
      rules: [
        ...config.module.rules,
        {
          test: /\.js$/,
          include: [EXAMPLES_PATH, SRC_PATH],
          exclude: /node_modules/,
          loader: require.resolve('babel-loader'),
        },
        {
          test: /\.s?[ac]ss$/,
          use: cssLoader,
        },
      ],
    },
    output: {
      path: BUNDLES_PATH,
      filename: 'app.js',
      publicPath: '/bundles/',
    },
    plugins: [...config.plugins],
  };
};
