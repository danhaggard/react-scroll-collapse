import createOrphanedNodeCache from './orphanedNodeCache';
import { getCollapserParentIdRoot } from '../selectors/collapser';

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


/*
  Simple singleton manager with lots of getters n setters.

  We use this to store tree related into.

  It caches results after the rood node initiates a state query causing the
  tree to be traversed.  Since every single nested component instance tries to
  do the same - as per the redux way - I use this cache to bypass redux entirely
  for this state now.

  It is passed down the context as a singleton that never changes its ID - so
  it doesn't cause re-renders.

  It also has a method to spit out and take back it's copy of state.  This is so
  it can be passed to a web worker - which don't accept function arguments.
  The worker passes back the modified state object it is saved back to the cache
  singleton.
*/

const createCache = (rootNodeIdArg = 0) => {

  let CACHE = null;

  let cacheLock = false;

  const resultObjFactory = (id, value, source) => ({
    id,
    value,
    source,
  });

  const clearCache = () => (CACHE = null);

  const getCache = () => CACHE;

  const setCache = newCache => (CACHE = newCache);

  const initCache = () => (CACHE = {
    currentReduxState: {},
    recursionCache: {},
  });

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

  /*
    TODO: clean up the cache lock.  It was used when I was tring to hack mapStateToProps
    to prevent selectors from recursing the tree.
  */
  const isCacheLocked = () => cacheLock;

  /*
    Rename - refers to result stored info about child item expanded state
    and the location this came from in the tree.
  */
  const getResult = getResultFactory(getRecursionCache);

  /*
    As above - the recursion algo caches the source of a false result
    Giving it info about where it needs to recurse further.
  */
  const getResultSources = id => (getResult('source')(id) || []);

  /*
    Gets the mapping from id to their location in the tree.  Depth first.
  */
  const getResultTreeId = id => (getResult('treeId')(id) || id);

  const getResultValue = getResult('value');

  const setResult = setResultFactory(getRecursionCache);

  /*
    OrphanNodeCache is attached here.
  */
  const orphanNodeCache = createOrphanedNodeCache(rootNodeIdArg, getResultTreeId, setResult('treeId'));

  const setOrphanNodeCache = newCache => orphanNodeCache.setCache(newCache);

  /*
    Very dirty and coupled.  After a node mount / dismount - tree state needs to
    be checked.  But also, usually the tree ids needs to be re-mapped After
    newly mounted nodes are orphaned.

    The orphanNodeCache is piggy backing on the treeId generation to refresh it's
    knowledge of the tree - the spots where nodes will be orphaned if they mount,
    avoiding doing it twice after a node is orphaned.  The orphanNodeCache func
    wraps the func that sets the tree id.
  */
  const setResultTreeId = (id, val) => orphanNodeCache.setTreeIdWrapper(
    getCollapserParentIdRoot(getCurrentReduxState())
  )(id, val);


  const lockCache = () => (cacheLock = true);

  const unlockCache = () => (cacheLock = false);

  const recursionCache = {
    addResult,
    clearCache,
    deleteRecursionCacheEntry,
    getRecursionCache,
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
    setOrphanNodeCache,
    setRecursionCache,
    setResultTreeId,
    unlockCache,
    orphanNodeCache,
  };

  initCache(rootNodeIdArg);

  return recursionCache;
};

export default createCache;
