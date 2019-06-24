import { COLLAPSERS, ITEMS, SCROLLERS } from '../constants';
import createProvider from '../providerFactories/createProvider';
import { CollapserManager, CollapserContext } from '../contextManagers';

const collapserProvider = createProvider(
  COLLAPSERS, // your provider type
  [SCROLLERS], // parent provider types
  [COLLAPSERS, ITEMS], // child provider types
  CollapserContext, // base class to extend the provider and pass methods to the context.
  // CollapserManager // A HoC which passes props into the wrapped component.
);

export default collapserProvider;
