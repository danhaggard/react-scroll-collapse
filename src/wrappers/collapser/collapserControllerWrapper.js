import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { collapserControllerActions } from '../../actions';
import { cleanHoCProps } from '../../utils/hocUtils/cleanHoCProps';

export const collapserControllerWrapper = (CollapserController) => {

  class WrappedCollapserController extends Component {

    constructor(props) {
      super(props);
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
        addCollapser, _reactScrollCollapse: { id, isRootNode, parents: { collapser, scroller } }
      } = this.props;
      addCollapser(scroller, collapser, id, isRootNode);
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
