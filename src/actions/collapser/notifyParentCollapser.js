import { NOTIFY_PARENT_COLLAPSER } from '../const';

const notifyParentCollapser = collapserId => ({
  type: NOTIFY_PARENT_COLLAPSER,
  payload: {
    collapserId,
  }
});

export default notifyParentCollapser;
