import collapserProvider from './providers/collapserProvider';
import itemProvider from './providers/itemProvider';
import scrollerProvider from './providers/scrollerProvider';
import { CONTEXTS } from './constants';

export default {
  CONTEXTS,
  collapserProvider: comp => collapserProvider(CONTEXTS.MAIN, comp),
  itemProvider: comp => itemProvider(CONTEXTS.MAIN, comp),
  scrollerProvider: comp => scrollerProvider(CONTEXTS.MAIN, comp)
};
