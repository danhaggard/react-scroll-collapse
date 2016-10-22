import { SCROLL_TO } from './../const';

function action(scrollerId, offsetTop, scrollTop) {
  return {
    type: SCROLL_TO,
    payload: {
      scrollerId,
      offsetTop,
      scrollTop,
    },
  };
}

module.exports = action;
