import { combineReducers } from 'redux';

import { scrollers, scrollersReducer } from './scroller';
import { collapsersReducer } from './collapser';
import { itemsReducer } from './collapserItem';
import { SET_RECURSE_NODE_TARGET } from '../actions/const';
import { getOrObject } from '../utils/selectorUtils';

export const recurseNodeTarget = (state = null, action) => {
  const { collapserId } = getOrObject(action, 'payload');
  switch (action.type) {
    case SET_RECURSE_NODE_TARGET:
      return collapserId;
    default:
      return state;
  }
};

export const entities = combineReducers({
  collapsers: collapsersReducer,
  items: itemsReducer,
  scrollers: scrollersReducer,
});

export const reactScrollCollapse = combineReducers({
  recurseNodeTarget,
  entities,
  scrollers,
});
