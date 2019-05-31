

export const filterObject = (objToFilter, objToFilterBy) => { //eslint-disable-line
  const newObj = {};
  Object.entries(objToFilter).forEach(([key, value]) => {
    if (!Object.keys(objToFilterBy).includes(key)) {
      newObj[key] = value;
    }
  });
  return newObj;
};
