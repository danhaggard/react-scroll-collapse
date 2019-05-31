import {
  compose,
  curryCompose,
  everyReducer,
  getOrArray,
  getOrDefault,
  getOrNull,
  passArgsToIteratorEvery,
} from '../utils/selectorUtils';
import { getEntitiesRoot } from './common';

import { getItemExpanded, getItemRoot } from './collapserItem';
import recurseToNodeArray from './recurseToNodeArray';
import recurseAllChildren from './recurseAllChildren';
import recurseTreeIds from './recurseTreeIds';
import recurseSetCacheValues from './recurseSetCacheValues';

const getCollapsers = entitiesObject => getOrNull(entitiesObject, 'collapsers');

// rootState => collapsersObject
const getCollapsersRoot = compose(getCollapsers, getEntitiesRoot);

const getCollapser = collapsersObject => id => getOrNull(collapsersObject, id);


// rootState => id => collapserObject
const getCollapserRoot = compose(getCollapser, getCollapsersRoot);

/*
  -------------------------------- collapser.attr getters -----------------------------
*/

// --- collapser.collapsers:
const getCollapserCollapsers = collapserObject => getOrArray(collapserObject, 'collapsers');

export const getCollapserCollapsersRoot = curryCompose(getCollapserCollapsers, getCollapserRoot);

// --- collapser.items: => array
const getCollapserItems = collapserObject => getOrArray(collapserObject, 'items');

// rootState => id => collapserItemsArray
const getCollapserItemsRoot = curryCompose(getCollapserItems, getCollapserRoot);

// --- collapser.treeId:
const getCollapserTreeId = collapserObject => getOrNull(collapserObject, 'treeId');

export const getCollapserTreeIdRoot = curryCompose(getCollapserTreeId, getCollapserRoot);

// --- collapser.activeChildren: => array
const getCollapserActiveChildren = collapserObject => getOrArray(collapserObject, 'activeChildren');

// rootState, id => collapserActiveChildren
export const getCollapserActiveChildrenRoot = curryCompose(
  getCollapserActiveChildren,
  getCollapserRoot
);

// --- collapser.activeChildrenLimit: => number
const getCollapserActiveChildrenLimit = collapserObject => getOrDefault(Infinity)(
  collapserObject,
  'activeChildrenLimit'
);

// rootState => id => collapserActiveChildrenLimit
export const getCollapserActiveChildrenLimitRoot = curryCompose(
  getCollapserActiveChildrenLimit,
  getCollapserRoot
);


// getOrDefault

// rootState => id => true / false
const collapserItemsExpandedRootEvery = passArgsToIteratorEvery(
  getCollapserItemsRoot,
  getItemExpanded,
  getItemRoot
);


/*
  Used to set values below the target node as cheaply as possible.
*/
export const setNestedCollapserValuesRoot = (
  cache,
  getNodeChildrenMappedToTreeId,
) => (collapserIdObj, cachedValue) => {
  const valueToSet = !cachedValue;

  const getNodeChildren = (idObj) => {
    const prevResultSources = cache.getResultSources(idObj.id);
    // if we are expanding everything - then only go into false branches.
    if (valueToSet) return prevResultSources;
    // else go into branches that were expanded.
    return getNodeChildrenMappedToTreeId(idObj.id);
  };

  const setCache = (idObj, nextChildren) => {
    // if everything below is expanded - then there are no sources of falsity.
    // otherwise they are all sources of falsity.
    const resultSources = valueToSet ? [] : nextChildren;
    cache.addResult(idObj.id, valueToSet, resultSources);
  };
  recurseSetCacheValues(getNodeChildren, setCache, collapserIdObj);
  return valueToSet;
};

export const nestedCollapserItemsExpandedRootEvery = (
  state,
  nodeTargetArray,
  rootNodeId,
  cache,
) => {
  const mapIdToTreeId = id => ({ id, treeId: cache.getResultTreeId(id) });
  const targetNodeTreeIdArray = nodeTargetArray.map(mapIdToTreeId);
  const getNodeChildren = id => getCollapserCollapsersRoot(state)(id);
  const getNodeChildrenMappedToTreeId = id => getNodeChildren(id).map(mapIdToTreeId);
  const getNodeValue = id => collapserItemsExpandedRootEvery(state)(id);
  const setNestedCacheValues = setNestedCollapserValuesRoot(
    cache,
    getNodeChildrenMappedToTreeId,
  );
  return recurseToNodeArray({
    cache,
    getNodeChildrenMappedToTreeId,
    setNestedCacheValues,
    currentNodeIdObj: mapIdToTreeId(rootNodeId),
    resultReducer: everyReducer(true),
    getNodeValue,
    getTreeId: cache.getResultTreeId,
    targetNodeArray: targetNodeTreeIdArray, // change this arg name to the state key.
  });
};

export const nestedCollapserItemsRoot = (
  state,
  { _reactScrollCollapse: { id: collapserId } }
) => recurseAllChildren(
  id => getCollapserCollapsersRoot(state)(id),
  id => getCollapserItemsRoot(state)(id),
  (result, nextResult) => [...result, ...nextResult],
  collapserId,
);

export const setTreeIdsRecursively = (state, collapserId, action) => recurseTreeIds(
  id => getCollapserCollapsersRoot(state)(id),
  action,
  collapserId,
);

export const setTreeIdsRecursivelyToCache = (state, collapserId, cache) => recurseTreeIds(
  id => getCollapserCollapsersRoot(state)(id),
  cache.setResultTreeId,
  collapserId,
);
