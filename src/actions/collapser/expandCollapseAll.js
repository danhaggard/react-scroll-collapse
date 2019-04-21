import { EXPAND_COLLAPSE_ALL } from '../const';

const expandCollapseAll = (areAllItemsExpanded, itemId, collapserId) => ({
  type: EXPAND_COLLAPSE_ALL,
  payload: {
    areAllItemsExpanded,
    itemId,
    collapserId
  },
});

export default expandCollapseAll;
