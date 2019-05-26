import { combineReducers } from 'redux';
import { getOrObject, isUndefNull } from '../utils/selectorUtils';

import {
  ADD_COLLAPSER,
  ADD_SCROLLER,
  ADD_SCROLLER_CHILD,
  REMOVE_COLLAPSER,
  REMOVE_SCROLLER,
  REMOVE_SCROLLER_CHILD,
} from '../actions/const';


import {
  addToState,
  removeFromState,
  updateState
} from './utils';

//  handles the collapsers attr in scroller entities.
export const scrollerCollapsersIdArrayReducer = (state = [], action) => {
  const { collapserId } = getOrObject(action, 'payload');
  switch (action.type) {
    case ADD_COLLAPSER:
      return [...state, collapserId];
    case REMOVE_COLLAPSER:
      return state.filter(val => val !== collapserId);
    default:
      return state;
  }
};

export const scrollerIdReducer = (state = null, action) => {
  const { scrollerId } = getOrObject(action, 'payload');
  switch (action.type) {
    case ADD_SCROLLER:
      return scrollerId;
    default:
      return state;
  }
};

const scrollerReducer = combineReducers({
  collapsers: scrollerCollapsersIdArrayReducer,
  id: scrollerIdReducer,
});

export const scrollersReducer = (state = {}, action) => {
  const { parentScrollerId, scrollerId } = getOrObject(action, 'payload');
  switch (action.type) {
    case ADD_SCROLLER:
      return addToState(state, action, scrollerId, scrollerReducer);
    case REMOVE_SCROLLER:
      return removeFromState(state, scrollerId);
    case REMOVE_COLLAPSER:
    case ADD_COLLAPSER:
      if (!isUndefNull(parentScrollerId)) {
        return updateState(state, action, parentScrollerId, scrollerReducer);
      }
      return state;
    default:
      return state;
  }
};

export const scrollers = (state = [], action) => {
  const { scrollerId } = getOrObject(action, 'payload');
  switch (action.type) {
    case ADD_SCROLLER:
      return [...state, scrollerId];
    case REMOVE_SCROLLER:
      return state.filter(val => val !== scrollerId);
    default:
      return state;
  }
};
