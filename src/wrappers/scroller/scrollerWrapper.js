import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ofNumberTypeOrNothing } from '../../utils/propTypeHelpers';
import { scrollerWrapperActions } from '../../actions';
import cleanHoCProps from '../../utils/cleanHoCProps';
import providers from '../../contextProviders';

const { scrollerProvider } = providers;


export const scrollerWrapper = (ScrollerComponent) => {

  class WrappedScroller extends Component {

    constructor(props, context) {
      super(props, context);
      this.addScroller();
    }

    componentWillUnmount() {
      const { removeScroller, scrollerId } = this.props;
      removeScroller(scrollerId);
    }

    addScroller() {
      const {
        addScroller,
        scrollerId,
        scrollOnOpen,
        scrollOnClose
      } = this.props;
      const scroller = { id: scrollerId };
      addScroller(scroller, scrollerId, scrollOnOpen, scrollOnClose);
    }

    render() {
      const { scrollerId } = this.props;
      if (scrollerId >= 0) {
        return (
          <ScrollerComponent
            {...cleanHoCProps(
              this.props,
              WrappedScroller.defaultProps,
              scrollerWrapperActions
            )}
            scrollerId={scrollerId}
          />
        );
      }
      return <div />;
    }
  }

  WrappedScroller.defaultProps = {
    scrollerId: null,
    scrollOnClose: true,
    scrollOnOpen: true,
  };

  WrappedScroller.propTypes = {
    addScroller: PropTypes.func.isRequired,
    removeScroller: PropTypes.func.isRequired,
    scrollerId: ofNumberTypeOrNothing,
    scrollOnClose: PropTypes.bool,
    scrollOnOpen: PropTypes.bool,
  };

  return connect(undefined, scrollerWrapperActions)(scrollerProvider(WrappedScroller));
};

export default scrollerWrapper;
