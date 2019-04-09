import { ADD_COLLAPSER_CHILD } from './../const';

function action(parentCollapserId, collapser) {
  return {
    type: ADD_COLLAPSER_CHILD,
    payload: {
      collapser,
      parentCollapserId,
    },
  };
}

export default action;
