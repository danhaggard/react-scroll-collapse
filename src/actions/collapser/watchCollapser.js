import { WATCH_COLLAPSER } from './../const';

function action(collapserId) {
  return {
    type: WATCH_COLLAPSER,
    payload: {
      collapserId,
    },
  };
}

export default action;
