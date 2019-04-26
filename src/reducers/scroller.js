import { combineReducers } from 'redux';
import { getOrObject } from '../utils/selectorUtils';

import {
  ADD_SCROLLER,
  ADD_SCROLLER_CHILD,
  REMOVE_SCROLLER,
  REMOVE_SCROLLER_CHILD,
  SCROLL_TO
} from '../actions/const';

import {
  getNextIdFromArr,
  addToState,
  removeFromState,
  updateState
} from './utils';

//  handles the collapsers attr in scroller entities.
export const scrollerCollapsersIdArrayReducer = (state = [], action) => {
  const { collapser, collapserId } = getOrObject(action, 'payload');
  switch (action.type) {
    case ADD_SCROLLER_CHILD:
      return [...state, collapser.id];
    case REMOVE_SCROLLER_CHILD:
      return state.filter(val => val !== collapserId);
    default:
      return state;
  }
};

export const scrollerIdReducer = (state = null, action) => {
  const { scroller } = getOrObject(action, 'payload');
  switch (action.type) {
    case ADD_SCROLLER:
      return scroller.id;
    default:
      return state;
  }
};

export const offsetTopReducer = (state = 0, action) => {
  const { scroller, offsetTop } = getOrObject(action, 'payload');
  switch (action.type) {
    case ADD_SCROLLER:
      return scroller.offsetTop ? scroller.offsetTop : state;
    case SCROLL_TO:
      return offsetTop;
    default:
      return state;
  }
};

export const scrollTopReducer = (state = 0, action) => {
  const { scroller, scrollTop } = getOrObject(action, 'payload');
  switch (action.type) {
    case ADD_SCROLLER:
      return scroller.scrollTop ? scroller.scrollTop : state;
    case SCROLL_TO:
      return scrollTop;
    default:
      return state;
  }
};

export const toggleScrollReducer = (state = false, action) => {
  switch (action.type) {
    case SCROLL_TO:
      return !state;
    default:
      return state;
  }
};

const scrollerReducer = combineReducers({
  collapsers: scrollerCollapsersIdArrayReducer,
  id: scrollerIdReducer,
  offsetTop: offsetTopReducer,
  scrollTop: scrollTopReducer,
  toggleScroll: toggleScrollReducer,
});

export const scrollersReducer = (state = {}, action) => {
  const { scrollerId } = getOrObject(action, 'payload');
  switch (action.type) {
    case ADD_SCROLLER:
      return addToState(state, action, scrollerId, scrollerReducer);
    case REMOVE_SCROLLER:
      return removeFromState(state, scrollerId);
    case REMOVE_SCROLLER_CHILD:
    case ADD_SCROLLER_CHILD:
    case SCROLL_TO:
      return updateState(state, action, scrollerId, scrollerReducer);
    default:
      return state;
  }
};

export const scrollers = (state = [], action) => {
  const { scrollerId } = getOrObject(action, 'payload');
  switch (action.type) {
    case ADD_SCROLLER:
      return [...state, getNextIdFromArr(state)];
    case REMOVE_SCROLLER:
      return state.filter(val => val !== scrollerId);
    default:
      return state;
  }
};
