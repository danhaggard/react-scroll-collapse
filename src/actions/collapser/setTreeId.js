import { SET_TREE_ID } from '../const';

const setTreeId = (collapserId, treeId) => ({
  type: SET_TREE_ID,
  payload: {
    collapserId,
    treeId,
  }
});

export default setTreeId;
