import { isUndefNull } from '../utils/selectorUtils';

const recursionCacheFactory = () => {
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

  const getResult = key => (id) => {
    const result = cache[id];
    return !isUndefNull(result) ? result[key] : null;
  };

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

export default recursionCacheFactory;
