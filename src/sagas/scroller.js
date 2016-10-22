import {call, take, fork, actionChannel, put} from 'redux-saga/effects';

import * as types from '../actions/const';
import actions from '../actions';

const {scrollTo} = actions;
const {HEIGHT_READY_ALL, SET_OFFSET_TOP, WATCH_INITIALISE} = types;

/*
  Scroller UI related sagas
  ==========================
*/

/*
  not a root saga.  Is called by waitForSetOffsetTop below after a user action
  of clicking a collapser button.  Once it gets the signal that all collapsers
  have finished transitioning.  The call back methods passed from the view
  are now used to query the dom.  The results are dispatched to the store
  and used by the scroller to initiate the scroll.
*/
export function *waitForCollapserFinishSignal(scrollerId, getScrollTop, getOffsetTop) {
  const condition = true;
  while (condition) {
    yield take(HEIGHT_READY_ALL);
    const scrollTop = yield call(getScrollTop);
    const offsetTop = yield call(getOffsetTop);
    yield put(scrollTo(scrollerId, offsetTop, scrollTop));
    // returning here ensures the saga does not persist after the auto-scroll is finished
    // a new one will be generated each time a collapser button is clicked.
    return;
  }
}

/*
  this is not a root saga - ensuring it is only called after the scroller has mounted.
  This ensures that it doesn't receive any getOffsetTop callbacks without having
  a corresponding getScrollTop callback to go with it.
  It then waits for the user to click an expander button - at which point, the
  action below is dispatched by the collapsing element and 'taken' by the saga.
  the collapsing element passes it's getOffsetTop callback that allows us to
  query its backing instance for it's offsetTop info.
  Now that we have everything we need to query the dom to make the scroll happen
  We just have to wait for the collapser to finish.  This is done in the final saga
  waitForCollapserFinishSignal which is forked next.
*/
export function *waitForSetOffsetTop(scrollerId, getScrollTop) {
  const initChannel = yield actionChannel(SET_OFFSET_TOP);
  const condition = true;
  while (condition) {
    const {payload: {getOffsetTop}} = yield take(initChannel);
    yield fork(waitForCollapserFinishSignal, scrollerId, getScrollTop, getOffsetTop);
  }
}

/*
  This is a root saga. It is activated by the scroller on mount.  It receives the
  getScrollTop call back and immediately fires the next saga waitForSetOffsetTop.
  Which waits to be passed the getOffsetTop callback by the view when a user
  clicks an expander button.
*/
export function *scrollerInitWatch() {
  const initChannel = yield actionChannel(WATCH_INITIALISE);
  const condition = true;
  while (condition) {
    const {payload: {scrollerId, getScrollTop}} = yield take(initChannel);
    yield fork(waitForSetOffsetTop, scrollerId, getScrollTop);
  }
}
