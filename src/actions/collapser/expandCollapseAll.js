import { EXPAND_COLLAPSE_ALL } from './../const';

function action(items, areAllItemsExpanded) {
  return {
    type: EXPAND_COLLAPSE_ALL,
    payload: {
      items,
      areAllItemsExpanded,
    },
  };
}

module.exports = action;
