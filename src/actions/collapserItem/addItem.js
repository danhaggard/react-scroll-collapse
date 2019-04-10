import { ADD_ITEM } from '../const';

function action(collapserId, item, itemId) {
  return {
    type: ADD_ITEM,
    payload: {
      collapserId,
      item,
      itemId,
    },
  };
}

export default action;
