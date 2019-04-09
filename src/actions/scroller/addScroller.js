import { ADD_SCROLLER } from '../const';

const addScroller = (scroller, scrollerId) => ({
  type: ADD_SCROLLER,
  payload: {
    scroller,
    scrollerId,
  },
});

export default addScroller;
