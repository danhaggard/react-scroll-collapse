import {
  getOrNull,
  compose,
  curryCompose,
  everyReducer,
  getOrArray,
  passArgsToIteratorEvery,
} from '../utils/selectorUtils';
import { getEntitiesRoot } from './common';

import { getItemExpanded, getItemRoot } from './collapserItem';
import recurseToNodeArray from './recurseToNodeArray';
import recurseAllChildren from './recurseAllChildren';
import recurseTreeIds from './recurseTreeIds';


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

// rootState => id => true / false
const collapserItemsExpandedRootEvery = passArgsToIteratorEvery(
  getCollapserItemsRoot,
  getItemExpanded,
  getItemRoot
);

export const nestedCollapserItemsExpandedRootEvery = (
  state,
  { collapserId, nodeTargetArray },
  cache,
) => {
  const getTreeId = getCollapserTreeIdRoot(state);
  const mapIdToTreeId = id => ({ id, treeId: getTreeId(id) });
  const targetNodeTreeIdArray = nodeTargetArray.map(mapIdToTreeId);
  const getNodeChildren = id => getCollapserCollapsersRoot(state)(id).map(mapIdToTreeId);

  return recurseToNodeArray({
    cache,
    getNodeChildren,
    currentNodeIdObj: mapIdToTreeId(collapserId),
    resultReducer: everyReducer(true),
    getNodeValue: id => collapserItemsExpandedRootEvery(state)(id),
    getTreeId: getCollapserTreeIdRoot(state),
    targetNodeArray: targetNodeTreeIdArray, // change this arg name to the state key.
  });
};

export const nestedCollapserItemsRoot = (state, { collapserId }) => recurseAllChildren(
  id => getCollapserCollapsersRoot(state)(id),
  id => getCollapserItemsRoot(state)(id),
  (result, nextResult) => [...result, ...nextResult],
  collapserId,
);

export const setTreeIdsRecursively = (state, collapserId, action) => recurseTreeIds(
  id => getCollapserCollapsersRoot(state)(id),
  id => getCollapserTreeIdRoot(state)(id),
  action,
  collapserId,
);


export const createAreAllItemsExpandedSelector = (
  checkTreeStateSelector,
  nodeTargetArraySelector,
  loggingConfig = { logging: false, renderCount: 0 }
) => {
  let checkTreeStateCurrent = null;
  let checkTreeStateNext = null;
  let countCache;
  const { logging, renderCount } = loggingConfig;
  if (logging) {
    countCache = {};
    console.log('countCache', countCache);
  }
  return (state, props) => {
    const {
      cache,
      collapserId,
      isRootNode,
      rootNodeId
    } = props;
    let areAllItemsExpanded;
    const nodeTargetArray = nodeTargetArraySelector(state)(rootNodeId);

    if (isRootNode) {
      checkTreeStateNext = checkTreeStateSelector(state)(rootNodeId);
    }
    if (isRootNode && checkTreeStateNext !== checkTreeStateCurrent) {
      cache.unlockCache();
      areAllItemsExpanded = nestedCollapserItemsExpandedRootEvery(
        state, { ...props, nodeTargetArray }, cache
      );
      cache.lockCache();
      checkTreeStateCurrent = checkTreeStateNext;

      if (logging) {
        if (!countCache[collapserId]) {
          countCache[collapserId] = {};
        }
        if (!countCache[collapserId][renderCount]) {
          countCache[collapserId][renderCount] = 1;
        } else {
          countCache[collapserId][renderCount] += 1;
        }
      }
    } else {
      areAllItemsExpanded = nestedCollapserItemsExpandedRootEvery(
        state, { ...props, nodeTargetArray: [collapserId] }, cache
      );
    }
    return areAllItemsExpanded;
  };
};
