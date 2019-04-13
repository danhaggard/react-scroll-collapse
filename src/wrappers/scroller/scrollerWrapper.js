import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ofNumberTypeOrNothing } from '../../utils/propTypeHelpers';
import actions from '../../actions';
import cleanHoCProps from '../../utils/cleanHoCProps';
import providers from '../../contextProviders';

const { scrollerProvider } = providers;


export const scrollerWrapper = (ScrollerComponent) => {

  class WrappedScroller extends Component {

    constructor(props, context) {
      super(props, context);
      const { scrollerId } = this.props;
      this.scrollerId = scrollerId;

      this.addScroller();
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
      if (this.scrollerId >= 0) {
        return (
          <ScrollerComponent
            {...cleanHoCProps(
              this.props,
              WrappedScroller.defaultProps,
              WrappedScroller.propTypes // eslint-disable-line
            )}
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

  const mapDispatchToProps = {
    addScroller: actions.addScroller,
    removeScroller: actions.removeScroller,
  };

  return connect(undefined, mapDispatchToProps)(scrollerProvider(WrappedScroller));
};

export default scrollerWrapper;
