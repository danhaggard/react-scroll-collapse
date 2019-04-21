const selectorCache = {};

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

export const registerFactory = (selectorFactory, propKey) => {
  const { name } = selectorFactory;
  if (!selectorCache[name]) {
    selectorCache[name] = {};
    selectorCache[name].factory = wrapSelectorFactory(selectorFactory, propKey);
    selectorCache[name].propKey = propKey;
    selectorCache[name].selectors = {};
    return name;
  }
  throw new Error(`Sorry but a selector factory for ${name} has already been registered`);
};

export const getSelector = cacheKey => (props) => {
  const cache = selectorCache[cacheKey];
  const { factory, propKey, selectors } = cache;
  const selectorId = props[propKey];

  if (!selectors[selectorId] && selectorId !== undefined) {
    selectors[selectorId] = factory(selectorId);
    return cache.selectors[selectorId];
  }
  /*
    return a non cached selector when id is undefined.

    For cases where collapsers have no child collapsers.

    everyChildItemExpandedConditionSelectorFactory - returns true as the
    final recursion base case.
  */
  return factory(selectorId);
};


export const cacheSelector = (selectorFactory, propKey) => {

  const cacheKey = registerFactory(selectorFactory, propKey);
  const selector = getSelector(cacheKey);
  return (state, props) => selector(props).instance(state, props);
  // return (state, props) => selector(props).select(state);
};

export const getSelectorCache = () => selectorCache;

export const logAllRecomputations = () => {
  Object.entries(selectorCache).forEach(([key, selector]) => {
    console.log(key);
    Object.entries(selector.selectors).forEach(([id, obj]) => {
      console.log(`${selector.propKey}_${id} recomputations: ${obj.recomputations()}`);
    });
    console.log('');
  });
  console.log('');
  console.log('');
};
