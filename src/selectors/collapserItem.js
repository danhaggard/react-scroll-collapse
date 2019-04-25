import { getOrNull } from './common';


/*
  -------------------------------- item.attr getters -----------------------------
*/

// --- item.expanded
export const getItemExpanded = itemObj => getOrNull(itemObj, 'expanded');

// --- item.expanded
export const getItemWaitingForHeight = itemObj => getOrNull(itemObj, 'waitingForHeight');
