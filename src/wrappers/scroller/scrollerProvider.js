import createProvider from '../provider';

const scrollerProvider = createProvider(
  ['collapsers'],
  ({ id }) => ({
    parentScrollerId: id,
  }),
  'scrollers'
);

export default scrollerProvider;
