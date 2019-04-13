import { EXPAND_COLLAPSE } from '../const';

const expandCollapse = itemId => ({
  type: EXPAND_COLLAPSE,
  payload: {
    itemId,
  },
});

export default expandCollapse;
