/* Scroller Actions */
import removeScroller from './scroller/removeScroller';
import addScroller from './scroller/addScroller';

/* collapser actions */
import addToUnmountArray from './collapser/addToUnmountArray';
import removeFromUnmountArray from './collapser/removeFromUnmountArray';

import expandCollapseAll from './collapser/expandCollapseAll';
import removeCollapser from './collapser/removeCollapser';
import addCollapser from './collapser/addCollapser';
import setTreeId from './collapser/setTreeId';
import toggleCheckTreeState from './collapser/toggleCheckTreeState';

/* collapserItem actions */
import expandCollapse from './collapserItem/expandCollapse';
import removeItem from './collapserItem/removeItem';
import addItem from './collapserItem/addItem';

/* shared actions */
import addToNodeTargetArray from './collapser/addToNodeTargetArray';


const actions = {
  addCollapser,
  addToNodeTargetArray,
  removeCollapser,
  setTreeId,
  expandCollapseAll,
  addItem,
  removeItem,
  expandCollapse,
  addScroller,
  removeScroller,
  toggleCheckTreeState
};

export const collapserControllerActions = {
  addCollapser,
  removeCollapser,
};

export const collapserWrapperActions = {
  addCollapser,
  removeCollapser,
  addToUnmountArray,
  removeFromUnmountArray,
  addToNodeTargetArray,
  expandCollapseAll,
  setTreeId,
  toggleCheckTreeState,
};

export const itemControllerActions = {
  addItem,
  removeItem,
};


export const itemWrapperActions = {
  addToNodeTargetArray,
  expandCollapse,
};

export const scrollerWrapperActions = {
  addScroller,
  removeScroller,
};

export default actions;
