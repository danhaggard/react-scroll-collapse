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

  Check out sagas.js for more detail on how these sagas work as much of the
  control flow is similar.
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
  waitForCollapser is called for each mounted collapser.
*/
export function *waitForCollapser(collapserIdInit) {
  const watchCollapserChannel = yield actionChannel(WATCH_COLLAPSER);
  const removeCollapserChannel = yield actionChannel(REMOVE_COLLAPSER);

  const condition = true;
  while (condition) {

    const {watchCollapser, removeCollapser} = yield race({
      watchCollapser: take(watchCollapserChannel),
      removeCollapser: take(removeCollapserChannel)
    });

    if (watchCollapser) {
      const {payload: {collapserId}} = watchCollapser;

      if (collapserIdInit === collapserId) {
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
  collapserInitWatch watches for the WATCH_INIT_COLLAPSER action which is dispatch
  whenever a collapser is mounted.  It then calls the waitForCollapsers saga.
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
