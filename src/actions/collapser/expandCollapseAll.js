import { EXPAND_COLLAPSE_ALL } from '../const';

const expandCollapseAll = (
  item,
  areAllItemsExpanded,
  itemId,
  areSomeItemsExpanded,
  collapseIfSomeExpanded
) => ({
  type: EXPAND_COLLAPSE_ALL,
  payload: {
    areSomeItemsExpanded,
    collapseIfSomeExpanded,
    item,
    areAllItemsExpanded,
    itemId,
  },
});

export default expandCollapseAll;
