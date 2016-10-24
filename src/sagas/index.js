import {waitForCollapser} from './collapser';
import {scrollerInitWatch} from './scroller';

export function *reactScrollCollapseSagas() {
  yield [
    waitForCollapser(),
    scrollerInitWatch(),
  ];
}
