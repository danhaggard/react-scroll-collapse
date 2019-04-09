import { REMOVE_SCROLLER } from '../const';

const removeScroller = scrollerId => ({
  type: REMOVE_SCROLLER,
  payload: {
    scrollerId,
  }
});

export default removeScroller;
