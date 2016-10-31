import {dev, dist, test} from './conf/webpack';

/**
 * The main webpack configuration.
 * @returns {object} - returns a webpack config object
 */
const OPTIONS = {
  PROJECT_ROOT: __dirname,
  NODE_ENV: process.env.NODE_ENV,
};

module.exports = (() => {
  switch (process.env.NODE_ENV) {
    case 'dev':
      return dev;
    case 'dist':
      return dist;
    case 'test':
      return test;
    default:
      return dev;
  }
})()(OPTIONS);


/*
/* eslint no-console: "off"
const webpackConfigs = require('./conf/webpack');
const defaultConfig = 'dev';

module.exports = (configName) => {

  // If there was no configuration give, assume default
  const requestedConfig = configName || defaultConfig;

  // Return a new instance of the webpack config
  // or the default one if it cannot be found.
  let LoadedConfig = defaultConfig;

  if (webpackConfigs[requestedConfig] !== undefined) {
    LoadedConfig = webpackConfigs[requestedConfig];
  } else {
    console.warn(`
      Provided environment "${configName}" was not found.
      Please use one of the following ones:
      ${Object.keys(webpackConfigs).join(' ')}
    `);
    LoadedConfig = webpackConfigs[defaultConfig];
  }

  const loadedInstance = new LoadedConfig();

  // Set the global environment
  process.env.NODE_ENV = loadedInstance.env;

  return loadedInstance.config;
};
*/
