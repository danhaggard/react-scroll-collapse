import { ADD_TO_NODE_TARGET_ARRAY } from '../const';

const addToNodeTargetArray = (collapserId, rootNodeId) => ({
  type: ADD_TO_NODE_TARGET_ARRAY,
  payload: {
    collapserId,
    rootNodeId,
  }
});

export default addToNodeTargetArray;
