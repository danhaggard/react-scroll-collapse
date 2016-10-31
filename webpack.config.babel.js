import {dev, dist, ghPages, test} from './conf/webpack';


/**
 * The main webpack configuration.
 * @returns {object} - returns a webpack config object
 */
const OPTIONS = {
  PROJECT_ROOT: __dirname,
  NODE_ENV: process.env.NODE_ENV,
};

const config = (() => {
  switch (process.env.NODE_ENV) {
    case 'dev':
      return dev;
    case 'dist':
      return dist;
    case 'ghPages':
      return ghPages;
    case 'test':
      return test;
    default:
      return test;
  }
})()(OPTIONS);

export default config;
