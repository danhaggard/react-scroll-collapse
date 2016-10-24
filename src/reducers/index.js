import {combineReducers} from 'redux';

import {scrollers, scrollersReducer} from './scroller';
import {collapsersReducer} from './collapser';
import {itemsReducer} from './collapserItem';

const entities = combineReducers({
  collapsers: collapsersReducer,
  items: itemsReducer,
  scrollers: scrollersReducer,
});

export const reactScrollCollapse = combineReducers({
  entities,
  scrollers,
});
