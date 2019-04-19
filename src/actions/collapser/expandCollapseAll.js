import { EXPAND_COLLAPSE_ALL } from '../const';

const expandCollapseAll = (item, areAllItemsExpanded, itemId, collapseIfSomeExpanded) => ({
  type: EXPAND_COLLAPSE_ALL,
  payload: {
    collapseIfSomeExpanded,
    item,
    areAllItemsExpanded,
    itemId,
  },
});

export default expandCollapseAll;
