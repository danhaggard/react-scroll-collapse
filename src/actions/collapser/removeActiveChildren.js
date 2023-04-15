import { REMOVE_ACTIVE_CHILDREN } from '../const';

const removeActiveChildren = (
  collapserId,
  activeChildrenToRemove,
) => ({
  type: REMOVE_ACTIVE_CHILDREN,
  payload: {
    collapserId,
    activeChildrenToRemove,
  }
});

export default removeActiveChildren;
