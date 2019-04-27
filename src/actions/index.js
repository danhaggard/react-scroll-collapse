/* Scroller Actions */
import scrollTo from './scroller/scrollTo';
import watchInitialise from './scroller/watchInitialise';
import setOffsetTop from './scroller/setOffsetTop';
import removeScroller from './scroller/removeScroller';
import addScroller from './scroller/addScroller';
import addScrollerChild from './scroller/addScrollerChild';
import removeScrollerChild from './scroller/removeScrollerChild';

/* collapser actions */
import heightReadyAll from './collapser/heightReadyAll';
import expandCollapseAll from './collapser/expandCollapseAll';
import removeCollapser from './collapser/removeCollapser';
import removeCollapserChild from './collapser/removeCollapserChild';
import addCollapser from './collapser/addCollapser';
import addCollapserChild from './collapser/addCollapserChild';
import addRootNode from './collapser/addRootNode';
import removeRootNode from './collapser/removeRootNode';

import watchCollapser from './collapser/watchCollapser';
import watchInitCollapser from './collapser/watchInitCollapser';

/* collapserItem actions */
import heightReady from './collapserItem/heightReady';
import expandCollapse from './collapserItem/expandCollapse';
import removeItem from './collapserItem/removeItem';
import addItem from './collapserItem/addItem';

/* shared actions */
import setRecurseNodeTarget from './collapser/setRecurseNodeTarget';


const actions = {
  addCollapser,
  addCollapserChild,
  addRootNode,
  removeRootNode,
  removeCollapser,
  removeCollapserChild,
  expandCollapseAll,
  heightReadyAll,
  watchCollapser,
  watchInitCollapser,
  addItem,
  removeItem,
  expandCollapse,
  heightReady,
  addScroller,
  addScrollerChild,
  removeScroller,
  removeScrollerChild,
  setOffsetTop,
  watchInitialise,
  scrollTo,
  setRecurseNodeTarget,
};

export const collapserControllerActions = {
  addCollapser,
  addCollapserChild,
  addRootNode,
  removeRootNode,
  removeCollapser,
  removeCollapserChild,
  addScrollerChild,
  removeScrollerChild,
};

export const collapserWrapperActions = {
  expandCollapseAll,
  setOffsetTop,
  setRecurseNodeTarget,
  watchCollapser,
  watchInitCollapser,
};

export const itemControllerActions = {
  addItem,
  removeItem,
};


export const itemWrapperActions = {
  heightReady,
  expandCollapse,
  setOffsetTop,
  setRecurseNodeTarget,
  watchCollapser,
};

export const scrollerWrapperActions = {
  addScroller,
  removeScroller,
};

export default actions;
