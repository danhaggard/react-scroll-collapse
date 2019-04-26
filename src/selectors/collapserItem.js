import { getOrNull, compose, curryCompose } from '../utils/selectorUtils';
import { getEntitiesRoot } from './common';

const getItems = entitiesObject => getOrNull(entitiesObject, 'items');

// rootState => itemsObject
const getItemsRoot = compose(getItems, getEntitiesRoot);

const getItem = itemsObject => id => getOrNull(itemsObject, id);


// rootState => id => itemObject
export const getItemRoot = compose(getItem, getItemsRoot);


/*
  -------------------------------- item.attr getters -----------------------------
*/

// --- item.expanded
export const getItemExpanded = itemObj => getOrNull(itemObj, 'expanded');

// rootState => id = true / false
export const getItemExpandedRoot = curryCompose(getItemExpanded, getItemRoot);

// --- item.waitingForHeight
export const getItemWaitingForHeight = itemObj => getOrNull(itemObj, 'waitingForHeight');
