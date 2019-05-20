import { COLLAPSERS, SCROLLERS } from '../constants';
import createProvider from '../createProvider';
import ScrollMethods from '../ScrollMethods';

const scrollerProvider = createProvider(
  SCROLLERS,
  [],
  [COLLAPSERS],
  ScrollMethods
);

export default scrollerProvider;
