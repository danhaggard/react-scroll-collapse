//
// Fast object iterators in JavaScript. from : https://stackoverflow.com/a/25700742
//

// ########################################################################
// Type Utilities (define once, then re-use for the life-time of our application)
// ########################################################################

/**
  * Compiles and returns the "pre-compiled iterator" for any type of given properties.
  */

export const compileIterator = function compileIterator(typeProperties) {
  // pre-compile constant iteration over object properties
  let iteratorFunStr = '(function(obj, cb) {\n';
  for (let i = 0; i < typeProperties.length; ++i) { //eslint-disable-line
    iteratorFunStr += `cb('${typeProperties[i]}', obj.${typeProperties[i]});\n`;
  }
  iteratorFunStr += '})';

  // actually compile and return the function
  return eval(iteratorFunStr); // eslint-disable-line
};

// Construct type-information and iterator for a performance-critical type,
// from an array of property names

export const declareType = function declareType(propertyNamesInOrder) {
  const self = {
    // "type description": listing all properties, in specific order
    propertyNamesInOrder,

    // compile iterator function for this specific type
    forEach: compileIterator(propertyNamesInOrder),

    // create new object with given properties of given order, and matching initial values
    construct(initialValues) {
      const o = {};
      propertyNamesInOrder.forEach(name => (o[name] = initialValues[name]));
      return o;
    }
  };
  return self;
};
