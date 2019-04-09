import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ofNumberTypeOrNothing } from '../../utils/propTypeHelpers';
import actions from '../../actions';
import selectors from '../../selectors';

const { nextScrollerIdSelector } = selectors.scroller;
const { ifNotFirstSec } = selectors.utils;
const { addScroller, removeScroller } = actions;

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
      this.props.actions.removeScroller(this.scrollerId);
    }

    addScroller() {
      const scroller = { id: this.scrollerId };
      this.props.actions.addScroller(scroller, this.scrollerId);
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
    actions: PropTypes.object.isRequired,
    scrollerId: ofNumberTypeOrNothing,
  };

  WrappedScroller.childContextTypes = {
    parentScrollerId: PropTypes.number,
  };

  const mapDispatch = dispatch => ({
    actions: bindActionCreators({
      addScroller,
      removeScroller,
    }, dispatch),
  });

  return connect(undefined, mapDispatch)(WrappedScroller);
};

export default scrollerWrapper;
