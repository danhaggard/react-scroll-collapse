import { REMOVE_COLLAPSER_CHILD } from './../const';

function action(parentCollapserId, collapserId) {
  return {
    type: REMOVE_COLLAPSER_CHILD,
    payload: {
      collapserId,
      parentCollapserId,
    },
  };
}

module.exports = action;
