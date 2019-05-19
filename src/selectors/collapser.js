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

import recurseToNode from './recurseToNode';
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

/*
export const nestedCollapserItemsExpandedRootEvery = (
  state,
  { collapserId, targetNodeArray },
  cache,
) => everyReducer(true)(
  targetNodeArray.map(targetNodeId => recurseToNode({
    cache,
    /*
    getNodeChildren: id => getCollapserCollapsersRoot(state)(id).map(
      childId => getCollapserTreeIdRoot(state)(childId)
    ),
    getNodeChildren: id => getCollapserCollapsersRoot(state)(id),
    currentNodeId: collapserId,
    resultReducer: everyReducer(true),
    getNodeValue: id => collapserItemsExpandedRootEvery(state)(id),
    getTreeId: getCollapserTreeIdRoot(state),
    targetNodeId,
  }))
);
*/

/*
export const nestedCollapserItemsExpandedRootEvery = (
  state,
  { collapserId, targetNodeId },
  cache,
) => recurseToNode({
  cache,
  getNodeChildren: id => getCollapserCollapsersRoot(state)(id),
  currentNodeId: collapserId,
  resultReducer: everyReducer(true),
  getNodeValue: id => collapserItemsExpandedRootEvery(state)(id),
  getTreeId: getCollapserTreeIdRoot(state),
  targetNodeId,
});
*/

export const nestedCollapserItemsExpandedRootEvery = (
  state,
  { collapserId, targetNodeArray },
  cache,
) => {
  const getTreeId = getCollapserTreeIdRoot(state);
  const mapIdToTreeId = id => ({ id, treeId: getTreeId(id) });
  const targetNodeTreeIdArray = targetNodeArray.map(mapIdToTreeId);
  const getNodeChildren = id => getCollapserCollapsersRoot(state)(id).map(mapIdToTreeId);

  return recurseToNodeArray({
    cache,
    getNodeChildren,
    currentNodeIdObj: mapIdToTreeId(collapserId),
    resultReducer: everyReducer(true),
    getNodeValue: id => collapserItemsExpandedRootEvery(state)(id),
    getTreeId: getCollapserTreeIdRoot(state),
    targetNodeArray: targetNodeTreeIdArray,
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
