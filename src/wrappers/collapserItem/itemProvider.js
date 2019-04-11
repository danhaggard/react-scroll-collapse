import createProvider from '../provider';

const itemProvider = createProvider(
  [],
  () => ({}),
  'items'
);

export default itemProvider;
