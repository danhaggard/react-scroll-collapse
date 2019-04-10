import { EXPAND_COLLAPSE_ALL } from '../const';

const expandCollapseAll = (item, areAllItemsExpanded, itemId) => ({
  type: EXPAND_COLLAPSE_ALL,
  payload: {
    item,
    areAllItemsExpanded,
    itemId,
  },
});

export default expandCollapseAll;
