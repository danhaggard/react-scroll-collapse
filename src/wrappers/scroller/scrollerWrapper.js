import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ofNumberTypeOrNothing } from '../../utils/propTypeHelpers';
import actions from '../../actions';
import cleanHoCProps from '../../utils/cleanHoCProps';
import providers from '../../contextProviders';

const { scrollerProvider } = providers;

const propTypeCache = {
  addScroller: PropTypes.func.isRequired,
  scrollerId: ofNumberTypeOrNothing,
  removeScroller: PropTypes.func.isRequired,
};

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
      const { addScroller, scrollerId } = this.props;
      const scroller = { id: scrollerId };
      addScroller(scroller, scrollerId);
    }

    render() {
      const { scrollerId } = this.props;
      if (scrollerId >= 0) {
        return (
          <ScrollerComponent
            {...cleanHoCProps(
              this.props,
              WrappedScroller.defaultProps,
              propTypeCache
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
  };

  WrappedScroller.propTypes = propTypeCache;

  const mapDispatchToProps = {
    addScroller: actions.addScroller,
    removeScroller: actions.removeScroller,
  };

  return connect(undefined, mapDispatchToProps)(scrollerProvider(WrappedScroller));
};

export default scrollerWrapper;
