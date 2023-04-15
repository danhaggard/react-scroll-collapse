import { ADD_SCROLLER } from '../const';

const addScroller = (scrollerId, scrollOnOpen, scrollOnClose) => ({
  type: ADD_SCROLLER,
  payload: {
    scrollerId,
    scrollOnOpen,
    scrollOnClose
  },
});

export default addScroller;
