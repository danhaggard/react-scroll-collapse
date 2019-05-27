import { REMOVE_FROM_UNMOUNT_ARRAY } from '../const';

const removeFromUnmountArray = (collapserId, rootNodeId) => ({
  type: REMOVE_FROM_UNMOUNT_ARRAY,
  payload: {
    collapserId,
    rootNodeId,
  }
});

export default removeFromUnmountArray;
