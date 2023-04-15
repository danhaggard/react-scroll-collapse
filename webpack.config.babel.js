require('@babel/register')({
  presets: ['@babel/preset-env']
});

const path = require('path');

const prodConfig = require('./config/webpack.production.config.js');
const devConfig = require('./config/webpack.development.config.js');
const ghPagesConfig = require('./config/webpack.ghPages.config.js');
const hotConfig = require('./config/webpack.development-hot.config.js');


const EXAMPLES_PATH = path.join(__dirname, 'examples');
const BUNDLES_PATH = path.resolve(EXAMPLES_PATH, 'bundles');

const OPTIONS = {
  PROJECT_ROOT: __dirname,
  BUNDLES_PATH,
  DIST_PATH: path.join(__dirname, 'dist'),
  EXAMPLES_PATH,
  SRC_PATH: path.join(__dirname, 'src'),
  DEVELOPMENT: process.env.NODE_ENV === ('development' || 'hot'),
  PRODUCTION: process.env.NODE_ENV === ('production' || 'ghPages'),
  TEST: process.env.NODE_ENV === 'test',
};

module.exports = (() => {
  switch (process.env.NODE_ENV) {
    case 'hot':
      return hotConfig;
    case 'production':
      return prodConfig;
    case 'development':
      return devConfig;
    case 'ghPages':
      return ghPagesConfig;
    default:
      return devConfig;
  }
})()(OPTIONS);
