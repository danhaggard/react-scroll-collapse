import { ADD_SCROLLER } from '../const';

const addScroller = (scroller, scrollerId, scrollOnOpen, scrollOnClose) => ({
  type: ADD_SCROLLER,
  payload: {
    scroller,
    scrollerId,
    scrollOnOpen,
    scrollOnClose
  },
});

export default addScroller;
