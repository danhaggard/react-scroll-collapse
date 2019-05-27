import {
  isUndefNull,
  getOrObject,
} from '../utils/selectorUtils';

const ERROR_MESSAGES = {
  noCacheResult: (id, cache) => `Error:
    you are setting a value for a cache result id: ${id} that doesn't exist yet in
    cache: ${cache}
  `
};

const getResultFactory = cache => key => (id) => {
  const result = cache[id];
  return !isUndefNull(result) ? result[key] : null;
};

const setResultFactory = cacheArg => key => (id, val) => {
  const cache = cacheArg;
  const result = cache[id];
  if (!isUndefNull(result)) {
    result[key] = val;
    return result;
  }
  cache[id] = {
    [key]: val
  };
  return cache[id];
};


const createCache = () => {
  let cache = {};

  let cacheLock = false;

  const resultObjFactory = (id, value, source) => ({
    id,
    value,
    source,
  });

  const getResultOrObj = id => getOrObject(cache, id);

  const addResult = (id, value, source) => {
    // so we can store additional info like treeId
    const resultObj = {
      ...getResultOrObj(id),
      ...resultObjFactory(id, value, source)
    };
    cache[id] = cacheLock ? cache[id] : resultObj;
    return value;
  };

  const clearCache = () => (cache = {});

  const getCache = () => cache;

  const isCacheLocked = () => cacheLock;

  const getResult = getResultFactory(cache);

  const getResultSources = id => (getResult('source')(id) || []);

  const getResultTreeId = id => (getResult('treeId')(id) || id);

  const getResultValue = getResult('value');

  const setResult = setResultFactory(cache);

  const setResultTreeId = setResult('treeId');

  const lockCache = () => (cacheLock = true);

  const unlockCache = () => (cacheLock = false);

  const recursionCache = {
    addResult,
    cache,
    clearCache,
    getResultSources,
    getResultTreeId,
    getResultValue,
    getCache,
    isCacheLocked,
    setResultTreeId,
    lockCache,
    unlockCache,
  };

  return recursionCache;
};

export default createCache;
