import { all } from 'redux-saga/effects';

import { collapserInitWatch } from './collapser';

export function* reactScrollCollapseSagas() {
  yield all([
    collapserInitWatch(),
  ]);
}

export default reactScrollCollapseSagas;
