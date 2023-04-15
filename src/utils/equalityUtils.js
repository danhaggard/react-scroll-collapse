import { compareIntArrays } from './arrayUtils';
import { hasOwnProperty } from './selectorUtils';

const createCompareCondition = defaultCondition => condition => (objB, objA) => (key) => {
  const a = !hasOwnProperty(objB, key);
  const b = !condition(objB[key], objA[key], defaultCondition);
  return (a || b);
};


const objKeyValShallowEquals = (valA, valB) => (valA === valB);

const defaultCondition = createCompareCondition(objKeyValShallowEquals);

const checkArrayCondition = (valA, valB, condition) => {
  if (Array.isArray(valA) && Array.isArray(valB)) {
    return compareIntArrays(valA, valB);
  }
  return condition(valA, valB);
};

export const shallowEqualExcept = (
  condition = defaultCondition(objKeyValShallowEquals)
) => (objA, objB) => {

  if (objA === objB) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  const finalCondition = condition(objA, objB);

  // Test for A's keys different from B.
  return !Object.keys(objA).some(key => finalCondition(key));

};

const arrayCondition = defaultCondition(checkArrayCondition);

export const shallowEqualExceptArray = shallowEqualExcept(arrayCondition);
