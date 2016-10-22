import {
  ADD_COLLAPSER,
  ADD_SCROLLER,
  SCROLL_TO,
} from '../actions/const';

import {checkAttr, getNextIdFromArr} from './utils';

//  handles the collapsers attr in scroller entities.
export const scrollerCollapsersIdArrayReducer = (state = [], action) => {
  const {collapser} = checkAttr(action, 'payload');
  switch (action.type) {
    case ADD_COLLAPSER:
      return [...state, collapser.id];
    default:
      return state;
  }
};

export const scrollerIdReducer = (state = null, action) => {
  const {scroller} = checkAttr(action, 'payload');
  switch (action.type) {
    case ADD_SCROLLER:
      return scroller.id;
    default:
      return state;
  }
};

export const offsetTopReducer = (state = 0, action) => {
  const {payload: {scroller}, payload} = action;
  switch (action.type) {
    case ADD_SCROLLER:
      return scroller.offsetTop ? scroller.offsetTop : state;
    case SCROLL_TO:
      return payload.offsetTop;
    default:
      return state;
  }
};

export const scrollTopReducer = (state = 0, action) => {
  const {payload: {scroller}, payload} = action;
  switch (action.type) {
    case ADD_SCROLLER:
      return scroller.scrollTop ? scroller.scrollTop : state;
    case SCROLL_TO:
      return payload.scrollTop;
    default:
      return state;
  }
};

export const scrollerReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_SCROLLER:
      return {
        ...state,
        // array of collapserIds for collapsers nested directly under this collapser
        collapsers: scrollerCollapsersIdArrayReducer(undefined, action),
        id: scrollerIdReducer(undefined, action),
        offsetTop: offsetTopReducer(undefined, action),
        scrollTop: scrollTopReducer(undefined, action),
      };
    case SCROLL_TO:
      return {
        ...state,
        offsetTop: offsetTopReducer(state.offsetTop, action),
        scrollTop: scrollTopReducer(state.scrollTop, action),
      };
    case ADD_COLLAPSER:
      return {
        ...state,
        collapsers: scrollerCollapsersIdArrayReducer(state.collapsers, action),
      };
    default:
      return state;
  }
};

export const scrollersReducer = (state = {}, action) => {
  const {scroller, scrollerId} = checkAttr(action, 'payload');
  let newState;
  switch (action.type) {
    case ADD_SCROLLER:
      newState = {...state};
      newState[scroller.id] = scrollerReducer(null, action);
      return newState;
    case ADD_COLLAPSER:
      newState = {...state};
      // if no scrollerId supplied - then this collapser is nested under another collapser
      if (scrollerId >= 0) {
        newState[scrollerId] = scrollerReducer(state[scrollerId], action);
      }
      return newState;
    case SCROLL_TO:
      newState = {...state};
      newState[scrollerId] = scrollerReducer(state[scrollerId], action);
      return newState;
    default:
      return state;
  }
};

export const scrollers = (state = [], action) => {
  switch (action.type) {
    case ADD_SCROLLER:
      return [...state, getNextIdFromArr(state)];
    default:
      return state;
  }
};
