import { ADD_TO_NODE_TARGET_ARRAY } from '../const';

const addToNodeTargetArray = (collapserId, rootNodeId, clearBeforeAdding = false) => ({
  type: ADD_TO_NODE_TARGET_ARRAY,
  payload: {
    collapserId,
    clearBeforeAdding,
    rootNodeId,
  }
});

export default addToNodeTargetArray;
