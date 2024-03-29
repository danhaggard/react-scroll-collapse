
const recurseSetCacheValues = (
  getNodeChildren,
  setCache,
  idObj,
) => {
  const recurseChildren = (currentIdObj) => {
    const nextChildren = getNodeChildren(currentIdObj);
    setCache(currentIdObj, nextChildren);
    nextChildren.forEach(childIdObj => recurseChildren(childIdObj));
  };
  return recurseChildren(idObj);
};

export default recurseSetCacheValues;
