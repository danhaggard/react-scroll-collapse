import { REMOVE_ITEM } from './../const';

function action(collapserId, itemId) {
  return {
    type: REMOVE_ITEM,
    payload: {
      collapserId,
      itemId,
    },
  };
}

export default action;
