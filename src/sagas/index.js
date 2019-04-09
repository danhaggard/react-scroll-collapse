import { collapserInitWatch } from './collapser';
import { scrollerInitWatch } from './scroller';

export function* reactScrollCollapseSagas() {
  yield [
    collapserInitWatch(),
    scrollerInitWatch(),
  ];
}
