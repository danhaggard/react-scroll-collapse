import React, { Component } from 'react';
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
      console.log('childContext', this.createChildContext(this.props));
      return (
        <Context.Provider {...this.createChildContext(this.props)}>
          <Comp {...this.props} />
        </Context.Provider>
      );
    }
  }

  ScrollerProvider.propTypes = {
    parentScrollerId: PropTypes.number.isRequired,
  };

  return registry(Context, ScrollerProvider, 'registerScroller', 'scrollers');
};


export default scrollerProvider;
