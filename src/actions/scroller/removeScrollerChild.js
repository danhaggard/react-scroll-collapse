import { REMOVE_SCROLLER_CHILD } from '../const';

function action(scrollerId, collapserId) {
  return {
    type: REMOVE_SCROLLER_CHILD,
    payload: {
      collapserId,
      scrollerId,
    },
  };
}

export default action;
