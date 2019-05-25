import { TOGGLE_CHECK_TREE_STATE } from '../const';

const toggleCheckTreeState = rootNodeId => ({
  type: TOGGLE_CHECK_TREE_STATE,
  payload: {
    rootNodeId,
  }
});

export default toggleCheckTreeState;
