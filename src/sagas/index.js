import { all } from 'redux-saga/effects';

import { collapserInitWatch } from './collapser';
import { scrollerInitWatch } from './scroller';

export function* reactScrollCollapseSagas() {
  yield all([
    collapserInitWatch(),
    scrollerInitWatch()
  ]);
}
