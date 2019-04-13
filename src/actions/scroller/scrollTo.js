import { SCROLL_TO } from '../const';

const scrollTo = (scrollerId, offsetTop, scrollTop) => ({
  type: SCROLL_TO,
  payload: {
    scrollerId,
    offsetTop,
    scrollTop,
  },
});

export default scrollTo;
