import { COLLAPSERS, ITEMS, SCROLLERS } from '../contextProviders/constants';

const wrapSelectorFactory = (selectorFactory, propKey) => (id) => {
  const that = {};
  that.instance = selectorFactory();
  that.propKey = propKey;
  that.props = { [propKey]: id };
  that.select = stateArg => that.instance(
    stateArg, that.props
  );
  that.recomputations = that.instance.recomputations;
  return that;
};

export const registerFactory = (
  cacheKey,
  propKey,
  selectorCacheArg,
  selectorFactory
) => {
  const selectorCache = selectorCacheArg;
  if (!selectorCache[cacheKey]) {
    selectorCache[cacheKey] = {};
    selectorCache[cacheKey].factory = wrapSelectorFactory(selectorFactory, propKey);
    selectorCache[cacheKey].propKey = propKey;
    selectorCache[cacheKey].selectors = {};
    return cacheKey;
  }
  throw new Error(`Sorry but a selector factory for ${cacheKey} has already been registered`);
};

export const getSelector = (selectorCache, cacheKey) => (props) => {
  const cache = selectorCache[cacheKey];

  const { factory, propKey, selectors } = cache;
  const selectorId = props[propKey];

  if (!selectors[selectorId] && selectorId !== undefined) {
    selectors[selectorId] = factory(selectorId);
    return cache.selectors[selectorId];
  }

  return factory(selectorId);
};


// creates the cacheSelector funcs we wrap our selectors with.
export const cacheSelectorWrapperFactory = (
  providerType, // e.g.  collapsers, items, scrollers
  providerSelectorCache // the main cache object for this provider type
) => (
  cacheKey, // this will be the name of the selector function being wrapped.
  propKey,
  selectorFactory,
) => {
  registerFactory(cacheKey, propKey, providerSelectorCache, selectorFactory);
  const selector = getSelector(cacheKey, providerSelectorCache);
  return (state, props) => selector(props).instance(state, props);
};

export const removeSelectorCacheFactory = selectorCache => (selectorId) => {
  Object.values(selectorCache).forEach((selector) => {
    const { selectors } = selector;
    delete selectors[selectorId];
  });
};


const providerCacheFactory = (providerType) => {
  const selectorCache = {};
  const that = {};
  that.cacheSelector = cacheSelectorWrapperFactory(providerType, selectorCache);
  that.removeSelectorCache = removeSelectorCacheFactory(selectorCache);
};

export const collapserCache = providerCacheFactory(COLLAPSERS);
export const itemCache = providerCacheFactory(ITEMS);
export const scrollerCache = providerCacheFactory(SCROLLERS);
