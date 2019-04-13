import { SET_OFFSET_TOP } from '../const';

const setOffsetTop = (getOffsetTop, scrollerId, collapserId, itemId) => ({
  type: SET_OFFSET_TOP,
  payload: {
    getOffsetTop,
    scrollerId,
    collapserId,
    itemId,
  },
});

export default setOffsetTop;
