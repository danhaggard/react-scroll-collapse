import { REMOVE_COLLAPSER } from '../const';

const removeCollapser = (parentScrollerId, parentCollapserId, collapserId, isRootNode) => ({
  type: REMOVE_COLLAPSER,
  payload: {
    collapserId,
    parentCollapserId,
    parentScrollerId,
    isRootNode,
  },
});

export default removeCollapser;
