import { REMOVE_ROOT_NODE } from '../const';

const removeCollapser = rootNodeId => ({
  type: REMOVE_ROOT_NODE,
  payload: {
    rootNodeId,
  },
});

export default removeCollapser;
