let cache = {};

let cacheLock = false;

const addResult = (id, result) => {
  cache[id] = cacheLock ? cache[id] : result;
  return result;
};

const clearCache = () => (cache = {});

const getCache = () => cache;

const isCacheLocked = () => cacheLock;

const getResult = id => (cacheLock ? cache[id] : null);

const lockCache = () => (cacheLock = true);

const unlockCache = () => (cacheLock = false);

const simpleCache = {
  addResult,
  clearCache,
  getResult,
  getCache,
  isCacheLocked,
  lockCache,
  unlockCache,
};

export default simpleCache;
