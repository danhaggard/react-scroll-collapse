const isUndefNull = val => val === null || val === undefined;

export const checkAttr = (obj, attr) => (!isUndefNull(obj[attr]) ? obj[attr] : {});

// find the maximum of the array and add one to it.
// zero index.
export const getNextIdFromArr = (arr) => (arr.length < 1 ? 0 : Math.max(...arr) + 1);

export const getNextIdFromObj = (obj) => {
  const keys = Object.keys(obj);
  return getNextIdFromArr(keys);
};
