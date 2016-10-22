import {waitForCollapser} from './collapser';
import {scrollerInitWatch} from './scroller';

export default function *rootSaga() {
  yield [
    waitForCollapser(),
    scrollerInitWatch(),
  ];
}
