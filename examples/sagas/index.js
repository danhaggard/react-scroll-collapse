import {reactScrollCollapseSagas} from '../../src';

export default function *sagas() {
  yield [
    reactScrollCollapseSagas(),
  ];
}
