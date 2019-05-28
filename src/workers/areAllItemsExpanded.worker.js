/* eslint-disable no-restricted-globals */
import { nestedCollapserItemsExpandedRootEvery } from '../selectors/collapser';
import { getNodeTargetArrayRoot } from '../selectors/rootNode';
import createCache from '../caching/recursionCache';


const areAllItemsExpandedSelector = (state, props) => {
  const {
    cacheClone,
    rootNodeId
  } = props;
  const cache = createCache();
  cache.setCache(cacheClone);
  const nodeTargetArray = getNodeTargetArrayRoot(state)(rootNodeId);
  console.log('nodeTargetArray', nodeTargetArray);
  console.log('state', state);
  if (cache.getMountInfo().mounting) {
    cache.setMountInfo({
      mounting: false,
    });
  }

  nestedCollapserItemsExpandedRootEvery(
    state, { ...props, nodeTargetArray }, cache
  );
  return cache.getCache();
};

self.addEventListener('message', (e) => { // eslint-disable-line no-restricted-globals
  if (!e) {
    return;
  }
  const { data: [state, props, cacheClone] } = e;
  const cache = areAllItemsExpandedSelector(state, props, cacheClone);
  postMessage(cache);
});
