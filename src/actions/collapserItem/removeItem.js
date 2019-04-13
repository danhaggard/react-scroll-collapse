import { REMOVE_ITEM } from '../const';

const removeItem = (collapserId, itemId) => ({
  type: REMOVE_ITEM,
  payload: {
    collapserId,
    itemId,
  },
});

export default removeItem;
