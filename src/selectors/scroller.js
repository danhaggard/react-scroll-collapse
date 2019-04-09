import { createSelector } from 'reselect';
import {
  selector,
  entitiesSelector,
  selectFunc,
  getNextIdFactory
} from './utils';

export const getScrollers = entities => selector(entities, 'scrollers');

export const getOffsetTop = scroller => selector(scroller, 'offsetTop');

export const getScrollTop = scroller => selector(scroller, 'scrollTop');

export const getToggleScroll = scroller => selector(scroller, 'toggleScroll');


export const getScrollerIdArray = scrollerCollapser => selector(scrollerCollapser, 'scrollers');

export const nextScrollerIdSelector = getNextIdFactory();

export const scrollersSelector = createSelector(entitiesSelector, getScrollers);

export const selectScrollerFunc = scrollers => scrollerId => selector(scrollers, scrollerId);

export const scrollerSelector = createSelector(scrollersSelector, selectScrollerFunc);

export const offsetTopSelector = createSelector(
  scrollerSelector, selectFunc(getOffsetTop)
);

export const scrollTopSelector = createSelector(
  scrollerSelector, selectFunc(getScrollTop)
);

export const toggleScrollSelector = createSelector(
  scrollerSelector, selectFunc(getToggleScroll)
);
