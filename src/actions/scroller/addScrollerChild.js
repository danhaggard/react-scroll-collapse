import { ADD_SCROLLER_CHILD } from '../const';

function action(scrollerId, collapser) {
  return {
    type: ADD_SCROLLER_CHILD,
    payload: {
      collapser,
      scrollerId,
    },
  };
}

export default action;
