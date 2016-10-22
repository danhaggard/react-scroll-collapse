/* Exports all the actions from a single point.

Allows to import actions like so:

import {action1, action2} from '../actions/'
*/
/* Populated by react-webpack-redux:action */
import scrollTo from './scroller/scrollTo.js';
import watchInitialise from './scroller/watchInitialise.js';
import setOffsetTop from './scroller/setOffsetTop.js';
import removeScroller from './scroller/removeScroller.js';
import addScroller from './scroller/addScroller.js';
import heightReady from './collapserItem/heightReady.js';
import transitionWait from './collapserItem/transitionWait.js';
import expandCollapse from './collapserItem/expandCollapse.js';
import removeItem from './collapserItem/removeItem.js';
import addItem from './collapserItem/addItem.js';
import heightReadyAll from './collapser/heightReadyAll.js';
import expandCollapseAll from './collapser/expandCollapseAll.js';
import removeCollapser from './collapser/removeCollapser.js';
import addCollapser from './collapser/addCollapser.js';
const actions = {
  addCollapser,
  removeCollapser,
  expandCollapseAll,
  heightReadyAll,
  addItem,
  removeItem,
  expandCollapse,
  transitionWait,
  heightReady,
  addScroller,
  removeScroller,
  setOffsetTop,
  watchInitialise,
  scrollTo
};
module.exports = actions;
