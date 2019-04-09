import { EXPAND_COLLAPSE } from './../const';

function action(itemId) {
  return {
    type: EXPAND_COLLAPSE,
    payload: {
      itemId,
    },
  };
}

export default action;
