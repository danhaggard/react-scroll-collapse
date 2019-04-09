import { createSelector } from 'reselect';
import { selector, entitiesSelector, getNextIdFactory } from './utils';

export const getItems = entities => selector(entities, 'items');

export const getItemExpanded = item => selector(item, 'expanded', true); // TODO: make default configureable

export const getItemId = item => selector(item, 'id');

export const getItemWaitingForHeight = item => selector(item, 'waitingForHeight');

export const selectItemFunc = items => itemId => selector(items, itemId);

export const selectItemExpandedFunc = innerSelectItemFunc => (itemId) => {
  const item = innerSelectItemFunc(itemId);
  return getItemExpanded(item);
};

export const selectItemWaitingForHeightFunc = innerSelectItemFunc => (itemId) => {
  const item = innerSelectItemFunc(itemId);
  return getItemWaitingForHeight(item);
};

export const itemsSelector = createSelector(entitiesSelector, getItems);

export const nextItemIdSelector = getNextIdFactory();

export const itemSelector = createSelector(itemsSelector, selectItemFunc);

export const itemExpandedSelector = createSelector(itemSelector, selectItemExpandedFunc);

export const itemWaitingForHeightSelector = createSelector(
  itemSelector, selectItemWaitingForHeightFunc
);
