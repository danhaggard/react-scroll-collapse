import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { collapserControllerActions } from '../../actions';
import { cleanHoCProps } from '../../utils/hocUtils/cleanHoCProps';
import { setContextAttrs } from '../../utils/objectUtils';

export const collapserControllerWrapper = (CollapserController) => {

  class WrappedCollapserController extends Component {

    constructor(props) {
      super(props);
      /* grab the context attrs under props._reactScrollCollapse and attach */
      setContextAttrs(this);
      this.addCollapser();
    }

    // Currently moved this func to collapserWrapper.
    /*
      componentWillUnmount() {
        const { removeCollapser } = this.props;
        const { collapserId, parentCollapserId, parentScrollerId } = this.props;
        removeCollapser(parentScrollerId, parentCollapserId, collapserId);
      }
    */

    addCollapser() {
      const {
        props: { addCollapser },
        parentScrollerId,
        parentCollapserId,
        id,
        isRootNode
      } = this;
      addCollapser(parentScrollerId, parentCollapserId, id, isRootNode);
    }

    render() {
      return (
        <CollapserController
          {...cleanHoCProps(
            this.props,
            collapserControllerActions
          )}
        />
      );
    }
  }

  WrappedCollapserController.defaultProps = {};

  WrappedCollapserController.propTypes = {
    _reactScrollCollapse: PropTypes.object.isRequired,
    addCollapser: PropTypes.func.isRequired,
    removeCollapser: PropTypes.func.isRequired,
  };

  WrappedCollapserController.whyDidYouRender = {
    logOnDifferentValues: false,
    customName: 'WrappedCollapserController'
  };

  return connect(undefined, collapserControllerActions)(WrappedCollapserController);
};

export default collapserControllerWrapper;
