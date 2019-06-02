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
    largestValueFromPrevMountCycle: rootNodeId - 1,
    largestValueFromThisMountCycle: rootNodeId - 1,
    mounting: false,
  });

  const clearCache = () => (CACHE = null);

  const getCache = () => CACHE;

  const setCache = newCache => (CACHE = newCache);

  const initCache = rootNodeId => (CACHE = {
    currentReduxState: {},
    mountInfo: initialMountInfoObjFactory(rootNodeId),
    recursionCache: {},
  });

  const getMountInfo = () => getCache().mountInfo;

  const setMountInfo = (obj) => {
    const cache = getCache();
    cache.mountInfo = {
      ...cache.mountInfo,
      ...obj
    };
    return cache.mountInfo;
  };

  const getRecursionCache = () => getCache().recursionCache;

  const setRecursionCache = obj => (getCache().recursionCache = obj);

  const getCurrentReduxState = () => getCache().currentReduxState;

  const setCurrentReduxState = obj => (getCache().currentReduxState = obj);

  const deleteRecursionCacheEntry = id => (delete getRecursionCache()[id]);

  const getResultOrObj = id => getOrObject(getRecursionCache(), id);

  const addResult = (id, value, source) => {
    // so we can store additional info like treeId
    const cache = getRecursionCache();
    const resultObj = {
      ...getResultOrObj(id),
      ...resultObjFactory(id, value, source)
    };
    cache[id] = cacheLock ? cache[id] : resultObj;
    return value;
  };

  const isCacheLocked = () => cacheLock;

  const getResult = getResultFactory(getRecursionCache);

  const getResultSources = id => (getResult('source')(id) || []);

  const getResultTreeId = id => (getResult('treeId')(id) || id);

  const getResultValue = getResult('value');

  const setResult = setResultFactory(getRecursionCache);

  const setResultTreeId = setResult('treeId');

  const lockCache = () => (cacheLock = true);

  const unlockCache = () => (cacheLock = false);

  const recursionCache = {
    addResult,
    clearCache,
    deleteRecursionCacheEntry,
    getRecursionCache,
    getMountInfo,
    getCurrentReduxState,
    getResultSources,
    getResultTreeId,
    getResultValue,
    getCache,
    initCache,
    isCacheLocked,
    lockCache,
    setCache,
    setCurrentReduxState,
    setMountInfo,
    setRecursionCache,
    setResultTreeId,
    unlockCache,
  };

  initCache(rootNodeIdArg);

  return recursionCache;
};

export default createCache;
