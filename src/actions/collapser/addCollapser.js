import { ADD_COLLAPSER } from '../const';

const addCollapser = (scrollerId, parentCollapserId, collapser, collapserId) => ({
  type: ADD_COLLAPSER,
  payload: {
    collapser,
    collapserId,
    parentCollapserId,
    scrollerId,
  }
});

export default addCollapser;
