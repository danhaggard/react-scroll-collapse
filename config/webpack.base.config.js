const path = require('path');
const webpack = require('webpack');


module.exports = (opts) => {
  const {
    DEVELOPMENT, PRODUCTION, DIST_PATH
  } = opts;
  // const entry = [path.join(SRC_PATH, 'index.js')];

  // environment vars - passed when running node e.g.
  // NODE_ENV=development node dev-server.js
  const define = new webpack.DefinePlugin({
    DEVELOPMENT: JSON.stringify(DEVELOPMENT),
    PRODUCTION: JSON.stringify(PRODUCTION),
  });

  const rules = [
    {
      test: /\.(jpg|png|gif)$/,
      exclude: /node_modules/,
      loaders: ['url-loader?limit=10000&name=images/[hash:12].[ext]'],
    }
  ];

  return {
    // entry,
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
