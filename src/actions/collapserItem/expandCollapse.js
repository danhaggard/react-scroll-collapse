import { EXPAND_COLLAPSE } from '../const';

const expandCollapse = (itemId, collapserId) => ({
  type: EXPAND_COLLAPSE,
  payload: {
    itemId,
    collapserId
  },
});

export default expandCollapse;
