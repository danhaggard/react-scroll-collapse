import { WATCH_INITIALISE } from '../const';

const watchInitialise = (scrollerId, getScrollTop) => ({
  type: WATCH_INITIALISE,
  payload: {
    scrollerId,
    getScrollTop,
  },
});

export default watchInitialise;
