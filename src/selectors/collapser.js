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
import recurseAllChildren from './recurseAllChildren';


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

const getCollapserCollapsersRoot = curryCompose(getCollapserCollapsers, getCollapserRoot);

// --- collapser.items: => array
const getCollapserItems = collapserObject => getOrArray(collapserObject, 'items');


// rootState => id => collapserItemsArray
const getCollapserItemsRoot = curryCompose(getCollapserItems, getCollapserRoot);

// rootState => id => true / false
const collapserItemsExpandedRootEvery = passArgsToIteratorEvery(
  getCollapserItemsRoot,
  getItemExpanded,
  getItemRoot
);


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
  targetNodeId,
});


export const nestedCollapserItemsRoot = (state, { collapserId }) => recurseAllChildren(
  id => getCollapserCollapsersRoot(state)(id),
  id => getCollapserItemsRoot(state)(id),
  (result, nextResult) => [...result, ...nextResult],
  collapserId,
);
