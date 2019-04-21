import { combineReducers } from 'redux';

import {
  ADD_COLLAPSER,
  ADD_COLLAPSER_CHILD,
  ADD_ITEM,
  EXPAND_COLLAPSE,
  EXPAND_COLLAPSE_ALL,
  HEIGHT_READY,
  REMOVE_ITEM,
  REMOVE_COLLAPSER,
  REMOVE_COLLAPSER_CHILD
} from '../actions/const';

import {
  checkAttr,
  addToState,
  removeFromState,
  updateState,
} from './utils';

import { itemsReducer } from './collapserItem';

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
  const { collapser } = checkAttr(action, 'payload');
  switch (action.type) {
    case ADD_COLLAPSER:
      return collapser.id;
    default:
      return state;
  }
};

//  handles the collapsers attr in collapsers entities.
export const collapsersIdArray = (state = [], action) => {
  const { collapser, collapserId } = checkAttr(action, 'payload');
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
  const { itemId } = checkAttr(action, 'payload');
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
  itemsObj: itemsReducer,
});

/* handles reactScrollCollapse.entities.collapsers state */
export const collapsersReducer = (state = {}, action) => {
  const { collapserId, parentCollapserId } = checkAttr(action, 'payload');
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
    case EXPAND_COLLAPSE:
    case EXPAND_COLLAPSE_ALL:
    case HEIGHT_READY:
      return updateState(state, action, collapserId, collapserReducer);
    default:
      return state;
  }
};
