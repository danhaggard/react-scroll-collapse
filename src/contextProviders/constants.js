import React from 'react';

export const COLLAPSERS = 'collapsers';
export const ITEMS = 'items';
export const SCROLLERS = 'scrollers';

const PROVIDER_TYPES = {
  COLLAPSERS,
  ITEMS,
  SCROLLERS,
};

export const CONTEXTS = {
  MAIN: React.createContext()
};

export default PROVIDER_TYPES;
