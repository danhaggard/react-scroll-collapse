const webpack = require('webpack');

module.exports = (opts) => {
  const {
    DEVELOPMENT, PRODUCTION, DIST_PATH
  } = opts;

  const define = new webpack.DefinePlugin({
    DEVELOPMENT: JSON.stringify(DEVELOPMENT),
    PRODUCTION: JSON.stringify(PRODUCTION),
  });

  const rules = [
    {
      test: /\.(jpg|png|gif)$/,
      exclude: /node_modules/,
      loaders: ['url-loader?limit=10000&name=images/[hash:12].[ext]'],
    },
    {
      test: /\.worker\.js$/,
      use: {
        loader: 'worker-loader',
        options: { inline: 'no-fallback' }
      }
    }
  ];

  return {
    plugins: [define],
    module: {
      rules
    },
    output: {
      path: DIST_PATH,
      publicPath: '/dist/',
      filename: 'bundle.js',
    },
  };
};
