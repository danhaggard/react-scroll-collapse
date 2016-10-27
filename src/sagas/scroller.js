import {call, race, take, fork, actionChannel, put} from 'redux-saga/effects';

import {HEIGHT_READY_ALL, SET_OFFSET_TOP,
  WATCH_INITIALISE, REMOVE_SCROLLER} from '../actions/const';
import {scrollTo} from '../actions';


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

  Multiple instances of this saga will take the SET_OFFSET_TOP action.  So we send
  the scrollerId as well with the action - so that it will only fork
  waitForCollapserFinishSignal if the scrollerId matches the one that was used
  to init the saga instance.
*/
export function *waitForSetOffsetTop(scrollerIdInit, getScrollTop) {
  const setOffsetTopChannel = yield actionChannel(SET_OFFSET_TOP);
  const removeScrollerChannel = yield actionChannel(REMOVE_SCROLLER);

  const condition = true;
  while (condition) {

    const {setOffsetTop, removeScroller} = yield race({
      setOffsetTop: take(setOffsetTopChannel),
      removeScroller: take(removeScrollerChannel)
    });

    if (setOffsetTop) {
      const {payload: {getOffsetTop, scrollerId}} = setOffsetTop;
      if (scrollerId === scrollerIdInit) {
        yield fork(waitForCollapserFinishSignal, scrollerId, getScrollTop, getOffsetTop);
      }
    } else {
      const {payload: {scrollerId}} = removeScroller;
      if (scrollerId === scrollerIdInit) {
        yield call(setOffsetTopChannel.close);
        yield call(removeScrollerChannel.close);
        return;
      }
    }
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
