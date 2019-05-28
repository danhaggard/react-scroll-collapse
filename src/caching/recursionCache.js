import {
  isUndefNull,
  getOrObject,
} from '../utils/selectorUtils';

const getResultFactory = getCache => key => (id) => {
  const cache = getCache();
  const result = cache[id];
  return !isUndefNull(result) ? result[key] : null;
};

const setResultFactory = getCache => key => (id, val) => {
  const cache = getCache();
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


const createCache = (rootNodeIdArg = 0) => {
  let CACHE = null;

  let cacheLock = false;

  const resultObjFactory = (id, value, source) => ({
    id,
    value,
    source,
  });

  const initialMountInfoObjFactory = rootNodeId => ({
    lastMountStartId: rootNodeId - 1,
    mountValue: rootNodeId - 1,
    mounting: false,
  });

  const getCache = () => CACHE;

  const getResultOrObj = id => getOrObject(getCache(), id);

  const addResult = (id, value, source) => {
    // so we can store additional info like treeId
    const cache = getCache();
    const resultObj = {
      ...getResultOrObj(id),
      ...resultObjFactory(id, value, source)
    };
    cache[id] = cacheLock ? cache[id] : resultObj;
    return value;
  };

  const clearCache = () => (CACHE = null);

  const getMountInfo = () => getCache().mountInfo;

  const setMountInfo = (obj) => {
    const cache = getCache();
    cache.mountInfo = {
      ...cache.mountInfo,
      ...obj
    };
  };

  const initCache = rootNodeId => (CACHE = {
    mountInfo: initialMountInfoObjFactory(rootNodeId)
  });

  const setCache = newCache => (CACHE = newCache);

  const isCacheLocked = () => cacheLock;

  const getResult = getResultFactory(getCache);

  const getResultSources = id => (getResult('source')(id) || []);

  const getResultTreeId = id => (getResult('treeId')(id) || id);

  const getResultValue = getResult('value');

  const setResult = setResultFactory(getCache);

  const setResultTreeId = setResult('treeId');

  const lockCache = () => (cacheLock = true);

  const unlockCache = () => (cacheLock = false);

  const recursionCache = {
    addResult,
    // cache: CACHE,
    clearCache,
    getMountInfo,
    setMountInfo,
    getResultSources,
    getResultTreeId,
    getResultValue,
    getCache,
    initCache,
    isCacheLocked,
    setCache,
    setResultTreeId,
    lockCache,
    unlockCache,
  };

  initCache(rootNodeIdArg);

  return recursionCache;
};

export default createCache;
