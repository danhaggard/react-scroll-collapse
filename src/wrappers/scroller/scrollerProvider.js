import createProvider from '../provider';

const scrollerProvider = createProvider(
  ['collapsers'],
  ({ id }) => ({
    parentScrollerId: id,
  }),
  'scrollers'
);
/*
import React from 'react';
import PropTypes from 'prop-types';
import childrenManager from '../ChildrenManager';
import registry from '../Registry';

const ScrollerChildrenManager = childrenManager(['collapsers']);

const scrollerProvider = (Context, Comp) => {
  class ScrollerProvider extends ScrollerChildrenManager {

    createChildContext = ({ id }) => ({
      parentScrollerId: id,
      ...this.childRegisterMethods,
    });

    render() {
      const childContext = this.createChildContext(this.props);
      return (
        <Context.Provider value={childContext}>
          <Comp {...this.props} />
        </Context.Provider>
      );
    }
  }

  ScrollerProvider.propTypes = {
    parentScrollerId: PropTypes.number.isRequired,
  };

  return registry(Context, ScrollerProvider, 'scrollers');
};

*/
export default scrollerProvider;
