import { ADD_COLLAPSER } from '../const';

const addCollapser = (parentScrollerId, parentCollapserId, collapserId, isRootNode) => ({
  type: ADD_COLLAPSER,
  payload: {
    collapserId,
    parentCollapserId,
    parentScrollerId,
    isRootNode,
  }
});

export default addCollapser;
