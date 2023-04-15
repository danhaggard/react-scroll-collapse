import { SET_ACTIVE_CHILDREN_LIMIT } from '../const';

const setActiveChildrenLimit = (
  collapserId,
  activeChildrenLimit,
) => ({
  type: SET_ACTIVE_CHILDREN_LIMIT,
  payload: {
    collapserId,
    activeChildrenLimit,
  }
});

export default setActiveChildrenLimit;
