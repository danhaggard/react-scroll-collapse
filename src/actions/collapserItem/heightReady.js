import { HEIGHT_READY } from './../const';

function action(collapserId, itemId) {
  return {
    type: HEIGHT_READY,
    payload: {
      collapserId,
      itemId,
    },
  };
}

module.exports = action;
