import { SET_ALL_CHILD_ITEMS_EXPANDED } from '../const';

const setAllChildItemsExpanded = (collapserId, allChildItemsExpanded) => ({
  type: SET_ALL_CHILD_ITEMS_EXPANDED,
  payload: {
    allChildItemsExpanded,
    collapserId,
  }
});

export default setAllChildItemsExpanded;
