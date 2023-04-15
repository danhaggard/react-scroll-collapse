import { combineReducers } from 'redux';
import { getOrObject } from '../utils/selectorUtils';

import {
  ADD_ITEM,
  EXPAND_COLLAPSE,
  EXPAND_COLLAPSE_ALL,
  REMOVE_ITEM
} from '../actions/const';

import {
  addToState,
  removeFromState,
  updateState,
  updateStateArray,
} from './utils';


export const expandedReducer = (state = true, action) => {
  const { areAllItemsExpanded, expanded } = getOrObject(action, 'payload');
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
  const { itemId } = getOrObject(action, 'payload');
  switch (action.type) {
    case ADD_ITEM:
      return itemId;
    default:
      return state;
  }
};

// handle state for individual items.
export const itemReducer = combineReducers({
  expanded: expandedReducer,
  id: itemIdReducer,
});

// handles items state
export const itemsReducer = (state = {}, action) => {
  const { itemId } = getOrObject(action, 'payload');
  switch (action.type) {
    case REMOVE_ITEM:
      return removeFromState(state, itemId);
    case ADD_ITEM:
      return addToState(state, action, itemId, itemReducer);
    case EXPAND_COLLAPSE:
      return updateState(state, action, itemId, itemReducer);
    case EXPAND_COLLAPSE_ALL:
      return updateStateArray(state, action, itemId, itemReducer);
    default:
      return state;
  }
};
