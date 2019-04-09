import PropTypes from 'prop-types';


export const ofTypeOrNothing = ofType => PropTypes.oneOfType([
  ofType,
  PropTypes.instanceOf(null),
  PropTypes.instanceOf(undefined),
]);

const ofChildrenType = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.node),
  PropTypes.node,
]);

export const ofChildrenTypeOrNothing = ofTypeOrNothing(ofChildrenType);

export const ofChildrenTypeOrString = PropTypes.oneOfType([
  ofChildrenType,
  PropTypes.string,
]);

export const ofFuncTypeOrNothing = ofTypeOrNothing(PropTypes.func);
export const ofNumberTypeOrNothing = ofTypeOrNothing(PropTypes.number);
