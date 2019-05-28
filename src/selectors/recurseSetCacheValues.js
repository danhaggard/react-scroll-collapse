
const recurseSetCacheValues = (
  getNodeChildren,
  setCache,
  idObj,
) => {
  const recurseChildren = (currentIdObj) => {
    /*
    if (currentIdObj.id !== idObj.id) {
      console.log('setting cache value below target node for id: ', currentIdObj.id);
    }
    */
    const nextChildren = getNodeChildren(currentIdObj);
    setCache(currentIdObj, nextChildren);
    nextChildren.forEach(childIdObj => recurseChildren(childIdObj));
  };
  return recurseChildren(idObj);
};

export default recurseSetCacheValues;
