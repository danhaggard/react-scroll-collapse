import { SET_RECURSE_NODE_TARGET } from '../const';

const setRecurseNodeTarget = (collapserId, rootNodeId) => ({
  type: SET_RECURSE_NODE_TARGET,
  payload: {
    collapserId,
    rootNodeId,
  }
});

export default setRecurseNodeTarget;
