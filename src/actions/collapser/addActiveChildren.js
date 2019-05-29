import { ADD_ACTIVE_CHILDREN } from '../const';

const addActiveChildren = (
  collapserId,
  activeChildrenToAdd,
  activeChildrenLimit,
) => ({
  type: ADD_ACTIVE_CHILDREN,
  payload: {
    collapserId,
    activeChildrenToAdd,
    activeChildrenLimit,
  }
});

export default addActiveChildren;
