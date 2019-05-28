import PROVIDER_TYPES, { PROVIDER_WORKERS } from '../contextProviders/constants';

const providerCaches = {}; // eslint-disable-line

Object.values(PROVIDER_TYPES).forEach((type) => {
  providerCaches[type] = {};
});

export default providerCaches;
