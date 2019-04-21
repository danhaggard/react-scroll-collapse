import { combineReducers } from 'redux';

import {
  ADD_ITEM,
  EXPAND_COLLAPSE,
  EXPAND_COLLAPSE_ALL,
  HEIGHT_READY,
  REMOVE_ITEM
} from '../actions/const';

import {
  addToState,
  checkAttr,
  updateState,
  removeFromState
} from './utils';


export const expandedReducer = (state = true, action) => {
  const { areAllItemsExpanded, expanded } = checkAttr(action, 'payload');
  switch (action.type) {
    case ADD_ITEM:
      return expanded;
    case EXPAND_COLLAPSE:
      return !state;
    case EXPAND_COLLAPSE_ALL:
      return !areAllItemsExpanded;
    default:
      return state;
  }
};

// handles 'id' attr for item entities.
export const itemIdReducer = (state = null, action) => {
  const { itemId } = checkAttr(action, 'payload');
  switch (action.type) {
    case ADD_ITEM:
      return itemId;
    default:
      return state;
  }
};

export const waitingForHeightReducer = (state = false, action) => {
  // const { item, areAllItemsExpanded } = checkAttr(action, 'payload');
  switch (action.type) {
    case ADD_ITEM:
    case HEIGHT_READY:
      return false;
    case EXPAND_COLLAPSE:
      return true;
    case EXPAND_COLLAPSE_ALL:
      /*
        If the parent collapser is expanding, but this indivdual
        collapserItem is already expanded, then it is not waiting
        for the onHeightReady callback to fire - return false. Otherwise
        return true.
        note: !(!a && b) === a || !b;
      */
      return false;
      // return areAllItemsExpanded || !getExpanded(item);
    default:
      return state;
  }
};

// handle state for individual items.
export const itemReducer = combineReducers({
  expanded: expandedReducer,
  id: itemIdReducer,
  waitingForHeight: waitingForHeightReducer,
});

// handles items state
export const itemsReducer = (state = {}, action) => {
  const { itemId } = checkAttr(action, 'payload');
  switch (action.type) {
    case REMOVE_ITEM:
      return removeFromState(state, itemId);
    case ADD_ITEM:
      return addToState(state, action, itemId, itemReducer);
    case HEIGHT_READY:
    case EXPAND_COLLAPSE:
    case EXPAND_COLLAPSE_ALL:
      return updateState(state, action, itemId, itemReducer);
    default:
      return state;
  }
};
