import { combineReducers } from 'redux';

import { scrollers, scrollersReducer } from './scroller';
import { collapsersReducer } from './collapser';
import { itemsReducer } from './collapserItem';
import { rootNodesReducer } from './rootNode';

export const entities = combineReducers({
  collapsers: collapsersReducer,
  items: itemsReducer,
  rootNodes: rootNodesReducer,
  scrollers: scrollersReducer,
});

export const reactScrollCollapse = combineReducers({
  entities,
  scrollers,
});
