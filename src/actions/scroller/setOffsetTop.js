import { SET_OFFSET_TOP } from './../const';

function action(getOffsetTop) {
  return {
    type: SET_OFFSET_TOP,
    payload: {
      getOffsetTop,
    },
  };
}

module.exports = action;
