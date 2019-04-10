import { all } from 'redux-saga/effects';

import { reactScrollCollapseSagas } from '../../src';

export default function* sagas() {
  yield all([
    reactScrollCollapseSagas(),
  ]);
}
