import { ADD_SCROLLER } from '../const';

const addScroller = scrollerId => ({
  type: ADD_SCROLLER,
  payload: {
    scrollerId,
  },
});

export default addScroller;
