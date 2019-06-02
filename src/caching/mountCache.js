import {
  isUndefNull,
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


const createMountCache = (rootNodeIdArg = 0) => {

  let CACHE = null;

  const initialMountInfoObjFactory = rootNodeId => ({
    largestValueFromPrevMountCycle: rootNodeId - 1,
    largestValueFromThisMountCycle: rootNodeId - 1,
    mounting: false,
  });

  const clearCache = () => (CACHE = null);

  const getCache = () => CACHE;

  const setCache = newCache => (CACHE = newCache);

  const initCache = rootNodeId => (CACHE = {
    mountInfo: initialMountInfoObjFactory(rootNodeId),
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


  const mountCache = {
    clearCache,
    getMountInfo,
    getCache,
    initCache,
    setCache,
    setMountInfo,
  };

  initCache(rootNodeIdArg);

  return mountCache;
};

export default createMountCache;
