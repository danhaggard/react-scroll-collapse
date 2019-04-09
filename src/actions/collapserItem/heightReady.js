import { HEIGHT_READY } from '../const';

const heightReady = (collapserId, itemId) => ({
  type: HEIGHT_READY,
  payload: {
    collapserId,
    itemId,
  },
});

export default heightReady;
