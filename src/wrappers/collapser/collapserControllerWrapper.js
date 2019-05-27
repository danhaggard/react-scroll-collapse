import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ofNumberTypeOrNothing } from '../../utils/propTypeHelpers';
import { collapserControllerActions } from '../../actions';
import cleanHoCProps from '../../utils/cleanHoCProps';

export const collapserControllerWrapper = (CollapserController) => {

  class WrappedCollapserController extends Component {

    constructor(props) {
      super(props);
      this.addCollapser();
    }

/*
    componentWillUnmount() {
      const { removeCollapser } = this.props;
      const { collapserId, parentCollapserId, parentScrollerId } = this.props;
      removeCollapser(parentScrollerId, parentCollapserId, collapserId);
    }
*/

    addCollapser() {
      const { addCollapser, isRootNode } = this.props;
      const { collapserId, parentCollapserId, parentScrollerId } = this.props;
      addCollapser(parentScrollerId, parentCollapserId, collapserId, isRootNode);
    }

    render() {
      const { collapserId, parentScrollerId } = this.props;
      if (collapserId >= 0 && parentScrollerId >= 0) {
        return (
          <CollapserController
            {...cleanHoCProps(
              this.props,
              WrappedCollapserController.defaultProps,
              collapserControllerActions
            )}
          />
        );
      }
      return <div />;
    }
  }

  WrappedCollapserController.defaultProps = {
    collapserId: null,
    parentCollapserId: null,
    parentScrollerId: null,
    rootNodes: {},
  };

  WrappedCollapserController.propTypes = {
    addCollapser: PropTypes.func.isRequired,
    isRootNode: PropTypes.bool.isRequired,
    rootNodes: PropTypes.object,
    rootNodeId: PropTypes.number.isRequired,
    providerType: PropTypes.string.isRequired,
    removeCollapser: PropTypes.func.isRequired,

    collapserId: ofNumberTypeOrNothing,
    parentCollapserId: ofNumberTypeOrNothing,
    parentScrollerId: ofNumberTypeOrNothing,
  };

  WrappedCollapserController.whyDidYouRender = {
    logOnDifferentValues: false,
    customName: 'WrappedCollapserController'
  };

  return connect(undefined, collapserControllerActions)(WrappedCollapserController);
};

export default collapserControllerWrapper;
