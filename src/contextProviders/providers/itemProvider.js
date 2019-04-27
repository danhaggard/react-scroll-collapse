import { COLLAPSERS, SCROLLERS, ITEMS } from '../constants';
import createProvider from '../createProvider';

const itemProvider = createProvider(
  ITEMS,
  [COLLAPSERS, SCROLLERS],
  [],
);

export default itemProvider;
