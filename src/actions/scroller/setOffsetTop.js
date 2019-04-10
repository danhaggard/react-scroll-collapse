import { SET_OFFSET_TOP } from '../const';

function action(getOffsetTop, scrollerId, collapserId, itemId) {
  return {
    type: SET_OFFSET_TOP,
    payload: {
      getOffsetTop,
      scrollerId,
      collapserId,
      itemId,
    },
  };
}

export default action;
