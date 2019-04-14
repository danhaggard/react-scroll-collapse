import React from 'react';

export const COLLAPSERS = 'collapser';
export const ITEMS = 'item';
export const SCROLLERS = 'scroller';

const PROVIDER_TYPES = {
  COLLAPSERS,
  ITEMS,
  SCROLLERS,
};

export const CONTEXTS = {
  MAIN: React.createContext()
};

export default PROVIDER_TYPES;
