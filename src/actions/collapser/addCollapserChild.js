import { ADD_COLLAPSER_CHILD } from '../const';

const addCollapserChild = (parentCollapserId, collapser) => ({
  type: ADD_COLLAPSER_CHILD,
  payload: {
    collapser,
    parentCollapserId,
  },
});

export default addCollapserChild;
