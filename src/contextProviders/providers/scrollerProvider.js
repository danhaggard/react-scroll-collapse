import { COLLAPSERS, SCROLLERS } from '../constants';
import createProvider from '../createProvider';

const scrollerProvider = createProvider(
  [COLLAPSERS],
  ({ id }) => ({
    parentScrollerId: id,
  }),
  SCROLLERS
);

export default scrollerProvider;
