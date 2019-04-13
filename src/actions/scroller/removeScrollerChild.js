import { REMOVE_SCROLLER_CHILD } from '../const';

const removeScrollerChild = (scrollerId, collapserId) => ({
  type: REMOVE_SCROLLER_CHILD,
  payload: {
    collapserId,
    scrollerId,
  },
});

export default removeScrollerChild;
