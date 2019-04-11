import { getNextIdFactory } from '../selectors/utils';
import hasOwnProperty from '../utils/hasOwnProperty';

const getEntityIdObj = {};

const getNextIdFromObj = objArg => (key) => {
  const obj = objArg;
  if (hasOwnProperty(obj, key)) {
    return obj[key]();
  }
  obj[key] = getNextIdFactory();
  return obj[key]();
};

const getNextId = getNextIdFromObj(getEntityIdObj);

export default getNextId;
