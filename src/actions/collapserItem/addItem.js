import { ADD_ITEM } from './../const';

function action(collapserId, item) {
  return {
    type: ADD_ITEM,
    payload: {
      collapserId,
      item,
    },
  };
}

module.exports = action;
