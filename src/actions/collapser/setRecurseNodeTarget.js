import { SET_RECURSE_NODE_TARGET } from '../const';

const setRecurseNodeTarget = collapserId => ({
  type: SET_RECURSE_NODE_TARGET,
  payload: {
    collapserId,
  }
});

export default setRecurseNodeTarget;
