import { WATCH_COLLAPSER } from '../const';

const watchCollapser = collapserId => ({
  type: WATCH_COLLAPSER,
  payload: {
    collapserId,
  },
});

export default watchCollapser;
