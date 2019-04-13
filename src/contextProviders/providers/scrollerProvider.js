import { COLLAPSERS, SCROLLERS } from '../constants';
import createProvider from '../createProvider';

const scrollerProvider = createProvider(
  SCROLLERS,
  [],
  [COLLAPSERS],
);

export default scrollerProvider;
