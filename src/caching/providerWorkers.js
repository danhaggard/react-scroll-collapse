import {
  isUndefNull,
} from '../utils/selectorUtils';

import PROVIDER_TYPES, { PROVIDER_WORKERS } from '../contextProviders/constants';


const createCache = (providerType) => {

  let CACHE = null;

  const Worker = PROVIDER_WORKERS[providerType];

  const getCache = () => CACHE;

  const getWorker = (id) => {
    const cache = getCache();
    if (isUndefNull(cache[id])) {
      cache[id] = new Worker();
    }
    return cache[id];
  };

  const clearCache = () => (CACHE = null);

  const initCache = () => (CACHE = {});

  const setCache = newCache => (CACHE = newCache);

  const cacheObj = {
    clearCache,
    getWorker,
    getCache,
    initCache,
    setCache,

  };

  initCache(providerType);

  return cacheObj;
};

const providerWorkers = {}; // eslint-disable-line

Object.values(PROVIDER_TYPES).forEach((type) => {
  providerWorkers[type] = createCache(type);
});

export default providerWorkers;
