import { COLLAPSERS, ITEMS, SCROLLERS } from '../constants';
import createProvider from '../providerFactories/createProvider';
import { CollapserContext } from '../contextManagers';

const collapserProvider = createProvider(
  COLLAPSERS, // your provider type
  [SCROLLERS], // parent provider types
  [COLLAPSERS, ITEMS], // child provider types
  CollapserContext, // base class to extend the provider and pass methods to the context.
);

export default collapserProvider;
