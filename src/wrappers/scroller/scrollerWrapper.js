import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { scrollerWrapperActions } from '../../actions';
import { cleanHoCProps } from '../../utils/hocUtils/cleanHoCProps';
import providers from '../../contextProviders';

const { scrollerProvider } = providers;


export const scrollerWrapper = (ScrollerComponent) => {

  class WrappedScroller extends Component {

    id = this.props._reactScrollCollapse.id

    constructor(props, context) {
      super(props, context);
      this.addScroller();
    }

    componentWillUnmount() {
      const { removeScroller } = this.props;
      removeScroller(this.id);
    }

    addScroller() {
      const { addScroller } = this.props;
      addScroller(this.id);
    }

    render() {
      return (
        <ScrollerComponent
          {...cleanHoCProps(
            this.props,
            scrollerWrapperActions
          )}
        />
      );

    }
  }

  WrappedScroller.defaultProps = {};

  WrappedScroller.propTypes = {
    _reactScrollCollapse: PropTypes.object.isRequired,
    addScroller: PropTypes.func.isRequired,
    removeScroller: PropTypes.func.isRequired,
  };

  WrappedScroller.whyDidYouRender = {
    logOnDifferentValues: false,
    customName: 'WrappedScroller'
  };

  return scrollerProvider(connect(undefined, scrollerWrapperActions)(WrappedScroller));
};

export default scrollerWrapper;
