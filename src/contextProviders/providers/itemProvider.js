import { COLLAPSERS, SCROLLERS, ITEMS } from '../constants';
import createProvider from '../providerFactories/createProvider';

const itemProvider = createProvider(
  ITEMS,
  [COLLAPSERS, SCROLLERS],
  [],
);

export default itemProvider;
