import {call, take, race, fork, actionChannel, select, put} from 'redux-saga/effects';

import * as types from '../actions/const';
import actions from '../actions';
import selectors from '../selectors';

const {haveAllItemsReportedHeightSelector} = selectors.collapser;
const {heightReadyAll} = actions;
const {HEIGHT_READY, REMOVE_COLLAPSER, WATCH_COLLAPSER, WATCH_INIT_COLLAPSER} = types;

/*
  Collapser UI related sagas
  ==========================
*/

/*
  This saga waits for HEIGHT_READY reports from the collapserItems.
  It continues to wait until all the child items for that collapser have reported.
*/
export function *waitForHeightReady(collapserIdInit) {
  let waiting = true;
  while (waiting) {
    yield take(HEIGHT_READY);
    const selector = yield select(haveAllItemsReportedHeightSelector);
    const haveAllReported = yield call(selector, collapserIdInit);
    if (haveAllReported) {
      waiting = false;
      yield put(heightReadyAll());
    }
  }
  return;
}

/*
  This saga is initiated for each mounted collapser.  It watches for when the
  WATCH_COLLAPSER action is fired (along side with expandCollapse(All)) - and
  performs cleanup on unmount.
*/
export function *waitForCollapser(collapserIdInit) {
  const watchCollapserChannel = yield actionChannel(WATCH_COLLAPSER);
  const removeCollapserChannel = yield actionChannel(REMOVE_COLLAPSER);
  const condition = true;
  while (condition) {

    /*
      This sets up a race between a collapser's expandCollapseAll action being
      fired (handled by watchCollapser) and the collapser being unmounted.

      Since we are in a never ending loop - the race will keep being run
      until removeCollapser channel finally wins (because of unmount).

      At this point we close both channels (to prevent any possible overflows)
      and return (closing out this saga)
    */
    const {watchCollapser, removeCollapser} = yield race({
      watchCollapser: take(watchCollapserChannel),
      removeCollapser: take(removeCollapserChannel)
    });

    if (watchCollapser) {
      const {payload: {collapserId}} = watchCollapser;

      /*
        remember that this generator is initiated for every collapser.  So they
        will ALL take the WATCH_COLLAPSER action when it is called.  So we check for
        that the payload collapserId matches the collapserId that this instance
        was called.

        Screening here allows us to deal with nested collapsers correctly.  If a
        nested collapser reports that all it's child items have finished transitioning
        then it coupld possibly fire the HEIGHT_READY_ALL action - even though some items in
        parent collapsers haven't finished transitioning yet.
      */

      if (collapserIdInit === collapserId) {
        /* Don't need to fork here as only one collapser will be active at a time */
        yield call(waitForHeightReady, collapserIdInit);
      }
    } else {
      const {payload: {collapserId}} = removeCollapser;
      if (collapserIdInit === collapserId) {
        yield call(watchCollapserChannel.close);
        yield call(removeCollapserChannel.close);
        return;
      }
    }

  }
}

/*
  this is initiated as a root saga.  It watches for the WATCH_INIT_COLLAPSER
  action which is fired whenever a collapser is mounted.  It then initiates
  the waitForCollapsers saga for that collapser.
*/
export function *collapserInitWatch() {
  const initChannel = yield actionChannel(WATCH_INIT_COLLAPSER);
  const condition = true;
  while (condition) {
    const {payload: {collapserId}} = yield take(initChannel);
    /*
      Fork here because we can have multiple collapsers mounting.
    */
    yield fork(waitForCollapser, collapserId);
  }
}
