import { isUndefNull } from '../utils/selectorUtils';


const getResultFactory = cache => key => (id) => {
  const result = cache[id];
  return !isUndefNull(result) ? result[key] : null;
};


const createCache = () => {
  let cache = {};

  let cacheLock = false;

  const resultObjFactory = (id, value, source) => ({
    id,
    value,
    source,
  });

  const addResult = (id, value, source) => {
    const resultObj = resultObjFactory(id, value, source);
    cache[id] = cacheLock ? cache[id] : resultObj;
    return value;
  };

  const clearCache = () => (cache = {});

  const getCache = () => cache;

  const isCacheLocked = () => cacheLock;

  const getResult = getResultFactory(cache);

  /*
    const getResult = key => (id) => {
      const result = cache[id];
      return !isUndefNull(result) ? result[key] : null;
    };
  */

  const getResultValue = getResult('value');

  const getResultSources = id => (getResult('source')(id) || []);

  const lockCache = () => (cacheLock = true);

  const unlockCache = () => (cacheLock = false);

  const recursionCache = {
    addResult,
    cache,
    clearCache,
    getResultSources,
    getResultValue,
    getCache,
    isCacheLocked,
    lockCache,
    unlockCache,
  };

  return recursionCache;
};

/*
const createCacheFactory = () => {
  const cache = createCache();

  const getCache = getResultFactory(cache);

  const addCache = (id) => {
    if (getCache(id) !== null) {
      throw new Error(`Error: recursion cache id: ${id} already exists`);
    }
    const newCache = createCache();
    cache.addResult(id, newCache);
  };

  const deleteCache = (id) => {
    delete cache[id];
  };

  const getAddCache = (id) => {
    const cacheValue = getCache(id);
    if (cacheValue === null) {
      cache.addResult(id);
    }
    return getCache(id);
  };

  return {
    addCache,
    deleteCache,
    getCache: getAddCache()
  };
};
*/

export default createCache;
