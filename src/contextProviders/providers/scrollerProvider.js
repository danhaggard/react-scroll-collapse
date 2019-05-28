import { COLLAPSERS, SCROLLERS } from '../constants';
import createProvider from '../createProvider';
import ScrollerContext from '../ScrollerContext';

const scrollerProvider = createProvider(
  SCROLLERS,
  [],
  [COLLAPSERS],
  ScrollerContext
);

export default scrollerProvider;
