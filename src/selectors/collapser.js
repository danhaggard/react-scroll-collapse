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

/*
  See /wrappers/collapserWrapper mapStateToProps for overall strategy
  and rationale for this.
*/
export const createAreAllItemsExpandedSelector = (
  checkTreeStateSelector,
  nodeTargetArraySelector,
  loggingConfig = { logging: false, renderCount: 0 }
) => {
  /*
    checkTreeState is a boolean that is toggled.  So we init and then
    watch for changes.  mapStateForProps is always called for the rootNode
    first before any children so when told to it checks the tree and then
    children just all look up the cached value.

    Here we just init the prev and current values and store them in a closure.
    mapStateToProps is a factory function so redux will create a separate
    instance of this function for every collapser instance.
  */
  let checkTreeStateCurrent = false;
  let checkTreeStateNext = false;
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
      isOpenedInit,
      isRootNode,
      rootNodeId
    } = props;
    let areAllItemsExpanded = cache.getResultValue(collapserId);

    /*
      The nodes that need checking in the tree.  recurse as quickly to
      each one and then check all below.  Could move this under the conditional
      below as well.
    */
    const nodeTargetArray = nodeTargetArraySelector(state)(rootNodeId);
    checkTreeStateNext = checkTreeStateSelector(state)(rootNodeId);
    // if (isRootNode) {
    // }
    debugger;
    /* Only check state if we are root and we've been told to */
    if (
      isRootNode
      && (areAllItemsExpanded === null || checkTreeStateNext !== checkTreeStateCurrent)
    ) {
      console.log('checking tree state');
      checkTreeStateCurrent = checkTreeStateNext;
      return nestedCollapserItemsExpandedRootEvery(
        state, { ...props, nodeTargetArray }, cache
      );
      /*
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
      */
      /*
        If cache is empty - then mapStateToProps is being called for the
        first time for this collapser.  No items have made it to the state yet
        so open question what value to return.  Currently the selector returns true,
        which means a re-render if default expanded state is set to false.

        Will naively use isOpenedInit for now - but if a child has a different value
        for this - the parent value will be invalidated.
      */
    }
    if (areAllItemsExpanded === null && isOpenedInit !== null) {
      return cache.addResult(collapserId, isOpenedInit, []);
    }
    if (areAllItemsExpanded === null) {
      return nestedCollapserItemsExpandedRootEvery(
        state, { ...props, nodeTargetArray: [collapserId] }, cache
      );
    }
    /* otherwise use the cache */
    return areAllItemsExpanded;
  };
};
