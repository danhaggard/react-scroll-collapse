import { ADD_COLLAPSER } from './../const';

function action(scrollerId, parentCollapserId, collapser, collapserId) {
  return {
    type: ADD_COLLAPSER,
    payload: {
      collapser,
      collapserId,
      parentCollapserId,
      scrollerId,
    },
  };
}

module.exports = action;
