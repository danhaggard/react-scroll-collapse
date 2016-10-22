const isUndefNull = val => val === null || val === undefined;

export const checkAttr = (obj, attr) => {
  return !isUndefNull(obj[attr]) ? obj[attr] : {};
};

export const getNextIdFromArr = (arr) => {
  // find the maximum of the array and add one to it.
  // zero index.
  return arr.length < 1 ? 0 : Math.max(...arr) + 1;
};

export const getNextIdFromObj = (obj) => {
  const keys = Object.keys(obj);
  return getNextIdFromArr(keys);
};

export const checkAction = (action) => {
  const {collapserId, scrollerId} = action;
  try {
    if (collapserId >= 0 && scrollerId >= 0) {
      // both aren't needed and it simplifies reducer logic if we can rely on
      // them not being there.
      throw new Error('Action should not contain both collapserId and scrollerId');
    }
  } catch (e) {
//    console.error(e);
  }
};
