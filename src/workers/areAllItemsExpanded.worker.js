/* eslint-disable no-restricted-globals */

import { nestedCollapserItemsExpandedRootEvery } from '../selectors/collapser';
import { getNodeTargetArrayRoot } from '../selectors/rootNode';
import createCache from '../caching/recursionCache';

/*
  You can't pass functions into webworkers.  So I pass in the
  object stored by the cache and then create a new cache manager object
  and attach the object to this new cache manager.

  This is passed into the recursion function which can call all
  the usual methods.  Then send the updated cache object back to the
  component which attaches it back to its own manager.
*/
const areAllItemsExpandedSelector = (state, props) => {
  const { orphanNodeCacheClone, cacheClone, rootNodeId, setTreeId, flipChildValues } = props;
  const cache = createCache();
  cache.setCache(cacheClone);
  cache.setOrphanNodeCache(orphanNodeCacheClone);
  const nodeTargetArray = getNodeTargetArrayRoot(state)(rootNodeId);

  nestedCollapserItemsExpandedRootEvery(
    state, nodeTargetArray, rootNodeId, cache, setTreeId, flipChildValues
  );
  return {
    orphanNodeCacheClone: cache.orphanNodeCache.getCache(),
    recursionCacheClone: cache.getCache(),
  };
};

self.addEventListener('message', (e) => {
  if (!e) {
    return;
  }
  const { data: [state, props] } = e;
  const cache = areAllItemsExpandedSelector(state, props);
  postMessage(cache);
});
