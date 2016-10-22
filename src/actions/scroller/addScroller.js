import { ADD_SCROLLER } from './../const';

function action(scroller) {
  return {
    type: ADD_SCROLLER,
    payload: {
      scroller,
    },
  };
}

module.exports = action;
