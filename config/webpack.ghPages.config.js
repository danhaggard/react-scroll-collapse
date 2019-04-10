const productionConfig = require('./webpack.production.config');
const developmentConfig = require('./webpack.development.config');

module.exports = (opts) => {
  const { BUNDLES_PATH, EXAMPLES_PATH } = opts;
  const config = productionConfig(opts);
  const devConfig = developmentConfig(opts);

  return {
    ...config,
    entry: EXAMPLES_PATH,
    externals: {},
    module: {
      rules: [
        ...devConfig.module.rules,
      ]
    },
    output: {
      path: BUNDLES_PATH,
      filename: 'app.js',
      publicPath: '/bundles/'
    }
  };
};
