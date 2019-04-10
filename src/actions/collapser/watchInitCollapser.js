import { WATCH_INIT_COLLAPSER } from '../const';

const watchInitCollapser = collapserId => ({
  type: WATCH_INIT_COLLAPSER,
  payload: {
    collapserId,
  },
});

export default watchInitCollapser;
