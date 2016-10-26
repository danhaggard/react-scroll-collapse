import { WATCH_INIT_COLLAPSER } from './../const';

function action(collapserId) {
  return {
    type: WATCH_INIT_COLLAPSER,
    payload: {
      collapserId,
    },
  };
}

module.exports = action;
