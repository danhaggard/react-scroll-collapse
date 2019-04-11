// https://eslint.org/docs/rules/no-prototype-builtins

export default (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
