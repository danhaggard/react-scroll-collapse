import { ADD_TO_UNMOUNT_ARRAY } from '../const';

const addToUnmountArray = (collapserIdArray, rootNodeId) => ({
  type: ADD_TO_UNMOUNT_ARRAY,
  payload: {
    collapserIdArray,
    rootNodeId,
  }
});

export default addToUnmountArray;
