import { ADD_SCROLLER_CHILD } from '../const';

const addScrollerChild = (scrollerId, collapser) => ({
  type: ADD_SCROLLER_CHILD,
  payload: {
    collapser,
    scrollerId,
  },
});

export default addScrollerChild;
