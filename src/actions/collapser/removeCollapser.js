import { REMOVE_COLLAPSER } from './../const';

function action(parentCollapserId, scrollerId, collapserId) {
  return {
    type: REMOVE_COLLAPSER,
    payload: {
      collapserId,
      parentCollapserId,
      scrollerId,
    },
  };
}

export default action;
