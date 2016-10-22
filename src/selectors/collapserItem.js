import {createSelector} from 'reselect';
import {selector, entitiesSelector} from './utils';
import {getNextIdFromObj} from '../reducers/utils';


export const getItems = entities => selector(entities, 'items');

export const getItemExpanded = item => selector(item, 'expanded');

export const getItemId = item => selector(item, 'id');

export const getItemWaitingForHeight = item => selector(item, 'waitingForHeight');

export const selectItemFunc = items => itemId => selector(items, itemId);

export const selectItemExpandedFunc = innerSelectItemFunc => itemId => {
  const item = innerSelectItemFunc(itemId);
  return getItemExpanded(item);
};

export const selectItemWaitingForHeightFunc = innerSelectItemFunc => itemId => {
  const item = innerSelectItemFunc(itemId);
  return getItemWaitingForHeight(item);
};

export const itemsSelector = createSelector(entitiesSelector, getItems);

export const nextItemIdSelector = createSelector(
  itemsSelector, items => getNextIdFromObj(items)
);

export const itemSelector = createSelector(itemsSelector, selectItemFunc);

export const itemExpandedSelector = createSelector(itemSelector, selectItemExpandedFunc);

export const itemWaitingForHeightSelector = createSelector(
  itemSelector, selectItemWaitingForHeightFunc);
