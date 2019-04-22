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

export const registerFactory = (selectorFactory, cacheKey, propKey) => {
  if (!selectorCache[cacheKey]) {
    selectorCache[cacheKey] = {};
    selectorCache[cacheKey].factory = wrapSelectorFactory(selectorFactory, propKey);
    selectorCache[cacheKey].propKey = propKey;
    selectorCache[cacheKey].selectors = {};
    return cacheKey;
  }
  throw new Error(`Sorry but a selector factory for ${cacheKey} has already been registered`);
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


export const cacheSelector = (selectorFactory, cacheKey, propKey) => {

  registerFactory(selectorFactory, cacheKey, propKey);
  const selector = getSelector(cacheKey);
  return (state, props) => selector(props).instance(state, props);
  // return (state, props) => selector(props).select(state);
};

export const getCache = () => selectorCache;

export const logDependencyRecomputations = (dependencies) => {
  dependencies.forEach((dependency) => {
    if (typeof dependency.recomputations === 'function') {
      console.log(`recomputations: ${dependency.recomputations()}`);
    }
    if (typeof dependency.resultFunc === 'function') {
      console.log(`resultFunc: ${dependency.resultFunc.name}`);
    }
    if (Array.isArray(dependency.dependencies)) {
      logDependencyRecomputations(dependency.dependencies);
    }
  });
};

export const logRecomputations = (selectorInstance) => {
  console.log(`recomputations: ${selectorInstance.recomputations()}`);
  logDependencyRecomputations(selectorInstance.dependencies);
};

export const logAllRecomputations = (logDependencies = false) => {
  Object.entries(selectorCache).forEach(([key, selector]) => {
    console.log(key);
    Object.entries(selector.selectors).forEach(([id, obj]) => {
      console.log(`${selector.propKey}_${id} recomputations: ${obj.recomputations()}`);
      if (logDependencies) {
        logDependencyRecomputations(obj.instance.dependencies);
      }
    });
    console.log('');
  });
  console.log('');
  console.log('');
};

export const cacheLogger = {};

cacheLogger.logAllRecomputations = logAllRecomputations;
cacheLogger.getCache = getCache;
