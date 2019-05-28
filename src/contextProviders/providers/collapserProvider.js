import { COLLAPSERS, ITEMS, SCROLLERS } from '../constants';
import createProvider from '../createProvider';
import CollapserManager from '../CollapserManager';

const collapserProvider = createProvider(
  COLLAPSERS, // your provider type
  [SCROLLERS], // parent provider types
  [COLLAPSERS, ITEMS], // child provider types
  undefined, // base class to extend the provider and pass methods to the context.
  CollapserManager // A HoC which passes props into the wrapped component.
);

export default collapserProvider;
