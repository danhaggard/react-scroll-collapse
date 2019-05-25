import { EXPAND_COLLAPSE_ALL } from '../const';

const expandCollapseAll = (areAllItemsExpanded, itemId, rootNodeId) => ({
  type: EXPAND_COLLAPSE_ALL,
  payload: {
    areAllItemsExpanded,
    itemId,
    rootNodeId
  },
});

export default expandCollapseAll;
