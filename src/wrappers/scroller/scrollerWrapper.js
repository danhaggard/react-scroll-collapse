import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ofNumberTypeOrNothing } from '../../utils/propTypeHelpers';
import actions from '../../actions';
import selectors from '../../selectors';

const { nextScrollerIdSelector } = selectors.scroller;
const { ifNotFirstSec } = selectors.utils;

export const scrollerWrapper = (ScrollerComponent) => {

  class WrappedScroller extends Component {

    constructor(props, context) {
      super(props, context);
      const { scrollerId } = this.props;
      this.scrollerId = ifNotFirstSec(scrollerId, nextScrollerIdSelector());
      this.addScroller();
    }

    getChildContext() {
      return {
        parentScrollerId: this.scrollerId,
      };
    }

    componentWillUnmount() {
      const { removeScroller } = this.props;
      removeScroller(this.scrollerId);
    }

    addScroller() {
      const { addScroller } = this.props;
      const scroller = { id: this.scrollerId };
      addScroller(scroller, this.scrollerId);
    }

    render() {
      const {
        scrollerId,
        ...other
      } = this.props;
      if (this.scrollerId >= 0) {
        return (
          <ScrollerComponent
            {...other}
            scrollerId={this.scrollerId}
          />
        );
      }
      return <div />;
    }
  }

  WrappedScroller.defaultProps = {
    scrollerId: null,
  };

  WrappedScroller.propTypes = {
    addScroller: PropTypes.func.isRequired,
    scrollerId: ofNumberTypeOrNothing,
    removeScroller: PropTypes.func.isRequired,
  };

  WrappedScroller.childContextTypes = {
    parentScrollerId: PropTypes.number,
  };

  const mapDispatchToProps = {
    addScroller: actions.addScroller,
    removeScroller: actions.removeScroller,
  };

  return connect(undefined, mapDispatchToProps)(WrappedScroller);
};

export default scrollerWrapper;
