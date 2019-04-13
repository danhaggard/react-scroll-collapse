import { ADD_ITEM } from '../const';

const addItem = (collapserId, item, itemId) => ({
  type: ADD_ITEM,
  payload: {
    collapserId,
    item,
    itemId,
  }
});

export default addItem;
