const webpack = require('webpack');
const baseConfig = require('./webpack.base.config.js');


module.exports = (opts) => {
  const {
    DEVELOPMENT,
    BUNDLES_PATH,
    EXAMPLES_PATH,
    SRC_PATH
  } = opts;
  const config = baseConfig(opts);
  // Swaps out newly changed code on the fly and updates the browser.
  const hotModuleReplacement = new webpack.HotModuleReplacementPlugin();

  // used in conjunction with HMR - just names the modules reported in console.
  const namedModulesPlugin = new webpack.NamedModulesPlugin();

  const cssIdentifier = '[path][name]---[local]';

  // source map.  If too slow build times. Can try: cheap-module-eval-source-map
  // but have noticed it leaves of names of functions etc...
  const devtool = 'eval-source-map';
  // const devtool = 'cheap-module-eval-source-map';

  const entry = [
    // activate HMR for React.  HMR entry points have to come before the others.
    'react-hot-loader/patch',

    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates
    'webpack/hot/only-dev-server',

    // add in our base config entry points.  Must come after HMR
    EXAMPLES_PATH,

    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint
    'webpack-dev-server/client?http://localhost:8080',
  ];
  const cssLoader = [
    {
      loader: 'style-loader',
      options: {
        sourceMap: DEVELOPMENT
      }
    },
    {
      loader: 'css-loader',
      options: {
        // This setting allows the use of hyphen in css class names in css
        // modules.  It gets converted into camel case when exported as the
        // object property name when the style is imported as a JS object.
        camelCase: true,
        localIdentName: cssIdentifier,

        // Turns on CSS modules.
        modules: true,
        sourceMap: DEVELOPMENT
      }
    },
    {
      loader: 'sass-loader',
      options: {
        localIdentName: cssIdentifier,
        sourceMap: DEVELOPMENT,
        modules: true
      }
    }
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
          loader: 'babel-loader'
        },
        {
          test: /\.s?[ac]ss$/,
          use: cssLoader,
        },
      ]
    },
    output: {
      path: BUNDLES_PATH,
      filename: 'app.js',
      publicPath: '/bundles/'
    },
    plugins: [
      ...config.plugins,
      hotModuleReplacement,
      namedModulesPlugin
    ]
  };
};
