import { combineReducers } from 'redux';

import {
  ADD_COLLAPSER,
  ADD_COLLAPSER_CHILD,
  ADD_ITEM,
  REMOVE_ITEM,
  REMOVE_COLLAPSER,
  REMOVE_COLLAPSER_CHILD,
  SET_TREE_ID,
} from '../actions/const';

import { getOrObject } from '../utils/selectorUtils';

import {
  addToState,
  removeFromState,
  updateState,
} from './utils';

/*
  Some notes regarding state:

  collapsers.(id).collapsers = is an array of collapserIds.  Represents the
  list of collapserController components that are nested one collapser level below
  the current.  Note - in the DOM a child collapser could still be arbitrarily
  deep even if the immediate child of a particular collapser.
  Array does not include ids of children of children - i.e. only 1 level of
  depth.

  collapsers.(id).items - array of collapserItemIds.  Same principle - items
  included can't be immediate children of other collapsers - but again can be nested
  arbitrarily deep in other components in the DOM.
*/

// handles the id attr for collapsers.
export const collapserIdReducer = (state = null, action) => {
  const { collapser } = getOrObject(action, 'payload');
  switch (action.type) {
    case ADD_COLLAPSER:
      return collapser.id;
    default:
      return state;
  }
};

export const collapserTreeIdReducer = (state = null, action) => {
  const { collapser, treeId } = getOrObject(action, 'payload');
  switch (action.type) {
    case ADD_COLLAPSER:
      return collapser.id;
    case SET_TREE_ID:
      return treeId;
    default:
      return state;
  }
};

//  handles the collapsers attr in collapsers entities.
export const collapsersIdArray = (state = [], action) => {
  const { collapser, collapserId } = getOrObject(action, 'payload');
  switch (action.type) {
    case ADD_COLLAPSER_CHILD:
      return [...state, collapser.id];
    case REMOVE_COLLAPSER_CHILD:
      return state.filter(val => val !== collapserId);
    default:
      return state;
  }
};

// handles the list of immediate child items nested under a collapser.
export const itemsIdArray = (state = [], action) => {
  const { itemId } = getOrObject(action, 'payload');
  switch (action.type) {
    case ADD_ITEM:
      return [...state, itemId];
    case REMOVE_ITEM:
      return state.filter(val => val !== itemId);
    default:
      return state;
  }
};

export const collapserReducer = combineReducers({
  collapsers: collapsersIdArray,
  id: collapserIdReducer,
  items: itemsIdArray,
  treeId: collapserTreeIdReducer,
});

/* handles reactScrollCollapse.entities.collapsers state */
export const collapsersReducer = (state = {}, action) => {
  const { collapserId, parentCollapserId } = getOrObject(action, 'payload');
  switch (action.type) {
    case ADD_COLLAPSER:
      return addToState(state, action, collapserId, collapserReducer);
    case ADD_COLLAPSER_CHILD:
    case REMOVE_COLLAPSER_CHILD:
      return updateState(state, action, parentCollapserId, collapserReducer);
    case REMOVE_COLLAPSER:
      return removeFromState(state, collapserId);
    case ADD_ITEM:
    case REMOVE_ITEM:
    case SET_TREE_ID:
      return updateState(state, action, collapserId, collapserReducer);
    default:
      return state;
  }
};
