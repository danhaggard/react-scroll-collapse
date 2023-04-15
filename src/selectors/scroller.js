import { getOrNull, compose, curryCompose } from '../utils/selectorUtils';
import { getEntitiesRoot } from './common';

const getScrollers = entitiesObject => getOrNull(entitiesObject, 'scrollers');

// rootState => scrollersObject
const getScrollersRoot = compose(getScrollers, getEntitiesRoot);

const getItem = itemsObject => id => getOrNull(itemsObject, id);


// rootState => id => scrollerObject
export const getScrollerRoot = compose(getItem, getScrollersRoot);


/*
  -------------------------------- item.attr getters -----------------------------
*/

// --- scroller.scrollOnOpen
export const getScrollerScrollOnOpen = scrollerObj => getOrNull(scrollerObj, 'scrollOnOpen');

// rootState => id = true / false
export const getScrollerScrollOnOpenRoot = curryCompose(getScrollerScrollOnOpen, getScrollerRoot);

// --- scroller.scrollOnOpen
export const getScrollerScrollOnClose = scrollerObj => getOrNull(scrollerObj, 'scrollOnClose');

// rootState => id = true / false
export const getScrollerScrollOnCloseRoot = curryCompose(getScrollerScrollOnClose, getScrollerRoot);
