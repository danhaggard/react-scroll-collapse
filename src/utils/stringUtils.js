export const capitalizeFirstLetter = str => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

export const removeLastLetter = str => str.slice(0, -1);

export const createGetterKey = key => `get${capitalizeFirstLetter(key)}`;
export const createSelectorKey = key => `${key}Selector`;
export const createTypeInstanceSelectorKey = typeKey => `${typeKey}InstanceSelector`;
