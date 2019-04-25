import { createSelector } from 'reselect';
import {
  getOrObject,
  getOrNull
} from './common';


import recurseToNode from './recurseToNode';

const getCollapsers = entitiesState => getOrObject(entitiesState, 'collapsers');

const getCollapser = (collapsersState, props) => collapsersState[props.collapserId];


/*
  -------------------------------- collapser.attr getters -----------------------------
*/

// --- collapser.collapsers:
const getCollapserCollapsers = collapserObj => getOrNull(collapserObj, 'collapsers');

const getCollapserItems = collapserObj => getOrNull(collapserObj, 'items');




export const getCollapserItemsExpandedEvery = (state, props) => recurseToNode({
  cache: simpleCache,
  childSelectorFunc: collapserId => childCollapserArraySelectorRoot(state, { collapserId }),
  currentNodeId: props.collapserId,
  evaluationFunc: arr => arr.every(a => (a === true)),
  selectorFunc: collapserId => areAllItemsExpandedSelector(state, { collapserId }),
  targetNodeId: props.targetNodeId,
});
