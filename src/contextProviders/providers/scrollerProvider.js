import { COLLAPSERS, SCROLLERS } from '../constants';
import createProvider from '../providerFactories/createProvider';
import { ScrollerContext } from '../contextManagers';

const scrollerProvider = createProvider(
  SCROLLERS,
  [],
  [COLLAPSERS],
  ScrollerContext
);

export default scrollerProvider;
