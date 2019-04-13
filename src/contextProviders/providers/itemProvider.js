import { ITEMS } from '../constants';
import createProvider from '../createProvider';

const itemProvider = createProvider(
  ITEMS,
  [],
  [],
);

export default itemProvider;
