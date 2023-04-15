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

/* collapser context actions */
import addActiveChildren from './collapser/addActiveChildren';
import removeActiveChildren from './collapser/removeActiveChildren';
import setActiveChildrenLimit from './collapser/setActiveChildrenLimit';

/* collapserItem actions */
import expandCollapse from './collapserItem/expandCollapse';
import removeItem from './collapserItem/removeItem';
import addItem from './collapserItem/addItem';

/* shared actions */
import addToNodeTargetArray from './collapser/addToNodeTargetArray';


const actions = {
  addActiveChildren,
  addCollapser,
  addItem,
  addScroller,
  addToNodeTargetArray,
  expandCollapse,
  expandCollapseAll,
  removeActiveChildren,
  removeCollapser,
  removeItem,
  removeScroller,
  setTreeId,
  toggleCheckTreeState,
};

export const collapserControllerActions = {
  addCollapser,
  removeCollapser,
};

export const collapserContextActions = {
  addActiveChildren,
  removeActiveChildren,
  setActiveChildrenLimit
};

export const collapserWrapperActions = {
  addActiveChildren,
  addToUnmountArray,
  addToNodeTargetArray,
  expandCollapseAll,
  removeActiveChildren,
  removeCollapser,
  removeFromUnmountArray,
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
