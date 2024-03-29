import { combineReducers } from 'redux';
import { getOrObject, isUndefNull } from '../utils/selectorUtils';

import {
  ADD_COLLAPSER,
  ADD_SCROLLER,
  REMOVE_COLLAPSER,
  REMOVE_SCROLLER,
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

export const scrollOnOpenReducer = (state = true, action) => {
  const { scrollOnOpen } = getOrObject(action, 'payload');
  switch (action.type) {
    case ADD_SCROLLER:
      return scrollOnOpen;
    default:
      return state;
  }
};

export const scrollOnCloseReducer = (state = true, action) => {
  const { scrollOnClose } = getOrObject(action, 'payload');
  switch (action.type) {
    case ADD_SCROLLER:
      return scrollOnClose;
    default:
      return state;
  }
};

const scrollerReducer = combineReducers({
  collapsers: scrollerCollapsersIdArrayReducer,
  id: scrollerIdReducer,
  scrollOnOpen: scrollOnOpenReducer,
  scrollOnClose: scrollOnCloseReducer,
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
