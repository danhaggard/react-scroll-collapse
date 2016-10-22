import { ADD_COLLAPSER } from './../const';

function action(scrollerId, parentCollapserId, collapser) {
  return {
    type: ADD_COLLAPSER,
    payload: {
      collapser,
      parentCollapserId,
      scrollerId,
    },
  };
}

module.exports = action;
