import React from 'react';
import CollapserWorker from '../workers/areAllItemsExpanded.worker';

export const COLLAPSERS = 'collapser';
export const ITEMS = 'item';
export const SCROLLERS = 'scroller';

const PROVIDER_TYPES = {
  COLLAPSERS,
  ITEMS,
  SCROLLERS,
};

export const PROVIDER_WORKERS = {
  [COLLAPSERS]: CollapserWorker
};

export const CONTEXTS = {
  MAIN: React.createContext()
};

export default PROVIDER_TYPES;
