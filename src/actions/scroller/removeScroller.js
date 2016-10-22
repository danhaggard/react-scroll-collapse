import { REMOVE_SCROLLER } from './../const';

function action(scrollerId) {
  return {
    type: REMOVE_SCROLLER,
    payload: {
      scrollerId,
    },
  };
}

module.exports = action;
