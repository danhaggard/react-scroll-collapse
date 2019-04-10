import { REMOVE_COLLAPSER_CHILD } from '../const';

const removeCollapserChild = (parentCollapserId, collapserId) => ({
  type: REMOVE_COLLAPSER_CHILD,
  payload: {
    collapserId,
    parentCollapserId,
  },
});

export default removeCollapserChild;
