import { getNextIdFactory, hasOwnProperty } from '../../utils/selectorUtils';


const createCounterStore = storeArg => (key) => {
  const store = storeArg;
  if (hasOwnProperty(store, key)) {
    return store[key]();
  }
  store[key] = getNextIdFactory();
  return store[key]();
};

const initStore = {};
const providerIdStore = createCounterStore(initStore);

export default providerIdStore;
