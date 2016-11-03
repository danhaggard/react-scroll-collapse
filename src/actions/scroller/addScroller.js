import { ADD_SCROLLER } from './../const';

function action(scroller, scrollerId) {
  return {
    type: ADD_SCROLLER,
    payload: {
      scroller,
      scrollerId,
    },
  };
}

module.exports = action;
