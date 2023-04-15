import { ADD_ITEM } from '../const';

const addItem = (collapserId, itemId, expanded = true) => ({
  type: ADD_ITEM,
  payload: {
    collapserId,
    itemId,
    expanded
  }
});

export default addItem;
