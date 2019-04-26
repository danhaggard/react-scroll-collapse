import { getOrNull, compose, curryCompose } from '../utils/selectorUtils';
import { getEntitiesRoot } from './common';


const getScrollers = entitiesObject => getOrNull(entitiesObject, 'scrollers');

const getScrollersRoot = compose(getScrollers, getEntitiesRoot);

const getScroller = scrollersObject => id => getOrNull(scrollersObject, id);

const getScrollerRoot = compose(getScroller, getScrollersRoot);


const getOffsetTop = scroller => getOrNull(scroller, 'offsetTop');

export const getOffsetTopRoot = curryCompose(getOffsetTop, getScrollerRoot);


const getScrollTop = scroller => getOrNull(scroller, 'scrollTop');

export const getScrollTopRoot = curryCompose(getScrollTop, getScrollerRoot);


const getToggleScroll = scroller => getOrNull(scroller, 'toggleScroll');

export const getToggleScrollRoot = curryCompose(getToggleScroll, getScrollerRoot);
