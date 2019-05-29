import { SET_ACTIVE_CHILDREN } from '../const';

const setActiveChildren = (
  collapserId,
  activeChildren,
) => ({
  type: SET_ACTIVE_CHILDREN,
  payload: {
    collapserId,
    activeChildren,
  }
});

export default setActiveChildren;
