import { ADD_ROOT_NODE } from '../const';

const addCollapser = rootNodeId => ({
  type: ADD_ROOT_NODE,
  payload: {
    rootNodeId,
  }
});

export default addCollapser;
