import { EXPAND_COLLAPSE_ALL } from './../const';

function action(item, areAllItemsExpanded, itemId) {
  return {
    type: EXPAND_COLLAPSE_ALL,
    payload: {
      item,
      areAllItemsExpanded,
      itemId,
    },
  };
}

export default action;
