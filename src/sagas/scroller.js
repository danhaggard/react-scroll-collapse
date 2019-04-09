import {
  call,
  race,
  take,
  fork,
  actionChannel,
  put
} from 'redux-saga/effects';

import {
  HEIGHT_READY_ALL,
  SET_OFFSET_TOP,
  WATCH_INITIALISE,
  REMOVE_SCROLLER
} from '../actions/const';

import actions from '../actions';

const { scrollTo } = actions;


/*
  Scroller UI related sagas
  ==========================
*/

/*
  waitForCollapserFinishSignal waits for the HEIGHT_READY_CALL action fired by
  a collapser - telling it that all collapserItems have reported their height
  and thus that it is safe to inspect the dom for scrollTop and offsetTop values.

  It then commences the scroll by putting the SCROLL_TO action - and then ends
  the saga instance.
*/
export function* waitForCollapserFinishSignal(scrollerId, getScrollTop, getOffsetTop) {
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
  The waitForSetOffsetTop saga is called once for every Scroller that is mounted.

  It waits for the SET_OFFSET_TOP action and is passed a getOffsetTop callback
  by a collapser or collapserItem.

  The control flow between scrollerInitWatch and waitForSetOffsetTop ensures
  that waitForSetOffsetTop doesn't receive any getOffsetTop callbacks without having
  a corresponding getScrollTop callback to go with it.

  Because there are multiple instances of this saga running (one for each scroller),
  once it has received both the getOffsetTop and getScrollTop callbacks it
  checks to make sure the collapser(Item) that dispatched the getOffsetTop callback
  is nested in the scroller corresponding to this saga instance - using the scrollerId
  passed in on saga init and the id passed in by the collapser(Item).

  it then forks waitForCollapserFinishSignal - and starts waiting again.

  If it receives a REMOVE_SCROLLER action - that means the scroller has unmounted
  It therefore cleans up the channels and returns - ending the saga instance for
  that scroller.

  -----
  Note on how the race call works.
  -----
  race allows you to watch for multiple actions and then do different
  things in response.

  Since we are in a never ending loop - the race will keep being run;
  receiving SET_OFFSET_TOP dispatches and causing auto scroll events in the view;
  until finally a REMOVE_SCROLLER action is dispatched ending the loop.
*/
export function* waitForSetOffsetTop(scrollerIdInit, getScrollTop) {
  const setOffsetTopChannel = yield actionChannel(SET_OFFSET_TOP);
  const removeScrollerChannel = yield actionChannel(REMOVE_SCROLLER);

  const condition = true;
  while (condition) {

    const { setOffsetTop, removeScroller } = yield race({
      setOffsetTop: take(setOffsetTopChannel),
      removeScroller: take(removeScrollerChannel)
    });

    if (setOffsetTop) {
      const { payload: { getOffsetTop, scrollerId } } = setOffsetTop;
      if (scrollerId === scrollerIdInit) {
        yield call(waitForCollapserFinishSignal, scrollerId, getScrollTop, getOffsetTop);
      }
    } else {
      const { payload: { scrollerId } } = removeScroller;
      if (scrollerId === scrollerIdInit) {
        /*
          Returning from the generator ends the saga instance - but I have had
          cases where the channels created in that saga continue to receive
          messages - but not clear them, leading to buffer overflow messages.

          So here we close the channels explicitly to prevent that from happening.
        */
        yield call(setOffsetTopChannel.close);
        yield call(removeScrollerChannel.close);
        return;
      }
    }
  }
}

/*
  This is a root saga. It waits for the WATCH_INITIALISE action which is dispatched
  by the Scroller component when mounted.  It receives the
  getScrollTop call back and calls the next saga waitForSetOffsetTop.
*/
export function* scrollerInitWatch() {
  const initChannel = yield actionChannel(WATCH_INITIALISE);
  const condition = true;
  while (condition) {
    const { payload: { scrollerId, getScrollTop } } = yield take(initChannel);
    /*
      Using fork here means that the loop can continue - allowing multiple sagas
      to be initialised for multiple scrollers if they are mounted - combined
      with using action channels which have a message buffer.
    */
    yield fork(waitForSetOffsetTop, scrollerId, getScrollTop);
  }
}
