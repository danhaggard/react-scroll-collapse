import PropTypes from 'prop-types';

export const arrayOfType = ofType => PropTypes.arrayOf(ofType);
export const arrayOfStrings = arrayOfType(PropTypes.string);

export const ofTypeOrNothing = (ofType, ofTypeArray = []) => {
  const concatArgs = ofType ? [ofType, ...ofTypeArray] : ofTypeArray;
  return PropTypes.oneOfType([
    ...concatArgs,
    PropTypes.instanceOf(null),
    PropTypes.instanceOf(undefined),
  ]);
};

export const ofChildrenType = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.node),
  PropTypes.node,
]);

export const ofChildrenTypeOrNothing = ofTypeOrNothing(ofChildrenType);

export const ofChildrenTypeOrString = PropTypes.oneOfType([
  ofChildrenType,
  PropTypes.string,
]);

export const ofBoolTypeOrNothing = ofTypeOrNothing(PropTypes.bool);
export const ofFuncTypeOrNothing = ofTypeOrNothing(PropTypes.func);
export const ofNumberTypeOrNothing = ofTypeOrNothing(PropTypes.number);
export const ofNumberStringTypeOrNothing = ofTypeOrNothing(
  undefined, [PropTypes.number, PropTypes.string]
);
