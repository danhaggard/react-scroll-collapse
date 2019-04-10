export const errorMessages = {
  forwardRefFailure: Comp => refName => `Error - ${Comp.displayName || Comp.name} must pass the ${refName} prop to the ref attribute of a DOM node`
};

export const checkForRef = (Comp, elem, refName) => {
  if (elem.current === null) {
    throw errorMessages.forwardRefFailure(Comp)(refName);
  }
};
