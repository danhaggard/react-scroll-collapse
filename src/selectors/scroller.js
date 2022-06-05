import {
  entitiesSelector,
  createEntityTypeSelectors
} from './utils';


const scroller = createEntityTypeSelectors(
  'scrollers',
  entitiesSelector,
  ['collapsers', 'offsetTop', 'scrollTop', 'toggleScroll', 'scrollOnOpen', 'scrollOnClose'],
);

export default scroller;
