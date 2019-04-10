import { REMOVE_COLLAPSER } from '../const';

const removeCollapser = (parentCollapserId, scrollerId, collapserId) => ({
  type: REMOVE_COLLAPSER,
  payload: {
    collapserId,
    parentCollapserId,
    scrollerId,
  },
});

export default removeCollapser;
