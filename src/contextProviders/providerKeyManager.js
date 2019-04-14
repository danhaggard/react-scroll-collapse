import { capitalizeFirstLetter } from '../utils/stringUtils';

export const getIdKey = typeKey => `${typeKey}Id`;
export const getParentIdKey = typeKey => `parent${capitalizeFirstLetter(getIdKey(typeKey))}`;
export const getChildIdKey = typeKey => `child${capitalizeFirstLetter(getIdKey(typeKey))}`;
