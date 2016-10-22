import {call, take, actionChannel, select, put} from 'redux-saga/effects';

import * as types from '../actions/const';
import actions from '../actions';
import selectors from '../selectors';

const {haveAllItemsReportedHeightSelector} = selectors.collapser;
const {heightReadyAll} = actions;
const {HEIGHT_READY} = types;


/*
  Collapser UI related sagas
  ==========================

  Using action channels means we can have use the same sagas for multiple UI
  components.
*/


/*
  this is initiated as a root saga.  It waits for the onHeightReady callback
  on the Collapser child elements to fire (which dispatches the action used in the
  action channel).  It will do a check for every collapser that fires the callback
  and if none of them are transitioning any more, then dispatches a signal
  saying that they are all done.  This is so we can ensure dom measurements
  are not performed during transitions.
*/
export function *waitForCollapser() {
  const initChannel = yield actionChannel(HEIGHT_READY);
  const condition = true;
  while (condition) {
    const {payload: {collapserId}} = yield take(initChannel);
    const selector = yield select(haveAllItemsReportedHeightSelector);
    const haveAllReported = yield call(selector, collapserId);
    if (haveAllReported) {
      yield put(heightReadyAll());
    }
  }
}
