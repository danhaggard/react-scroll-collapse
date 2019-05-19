import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ofNumberTypeOrNothing } from '../../utils/propTypeHelpers';
import { collapserControllerActions } from '../../actions';
import cleanHoCProps from '../../utils/cleanHoCProps';
import { getRootNodeId } from '../utils';

export const collapserControllerWrapper = (CollapserController) => {

  class WrappedCollapserController extends Component {

    constructor(props) {
      super(props);
      this.addCollapser();
      this.addRootNode();
    }

    componentWillUnmount() {
      const {
        removeCollapserChild,
        removeScrollerChild,
        removeCollapser
      } = this.props;
      const { collapserId, parentCollapserId, parentScrollerId } = this.props;
      if (parentCollapserId >= 0) {
        removeCollapserChild(parentCollapserId, collapserId);
      }
      if (parentScrollerId >= 0) {
        removeScrollerChild(parentScrollerId, collapserId);
      }
      removeCollapser(parentCollapserId, parentScrollerId, collapserId);
      this.removeRootNode();
    }

    addCollapser() {
      const { addCollapser, addScrollerChild, addCollapserChild } = this.props;
      const { collapserId, parentCollapserId, parentScrollerId } = this.props;
      const collapser = { id: collapserId };
      addCollapser(parentScrollerId, parentCollapserId, collapser, collapserId);
      if (parentScrollerId >= 0) {
        addScrollerChild(parentScrollerId, collapser);
      }
      if (parentCollapserId >= 0) {
        addCollapserChild(parentCollapserId, collapser);
      }
    }

    addRootNode() {
      const { addRootNode, isRootNode } = this.props;
      if (isRootNode) {
        addRootNode(getRootNodeId(this.props));
      }
    }

    removeRootNode() {
      const { removeRootNode, isRootNode } = this.props;
      if (isRootNode) {
        removeRootNode(getRootNodeId(this.props));
      }
    }

    render() {
      const { collapserId, parentScrollerId } = this.props;
      if (collapserId >= 0 && parentScrollerId >= 0) {
        return (
          <CollapserController
            rootNodeId={getRootNodeId(this.props)}
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
    addCollapserChild: PropTypes.func.isRequired,
    addRootNode: PropTypes.func.isRequired,
    isRootNode: PropTypes.bool.isRequired,
    rootNodes: PropTypes.object,
    providerType: PropTypes.string.isRequired,
    removeRootNode: PropTypes.func.isRequired,
    removeCollapser: PropTypes.func.isRequired,
    removeCollapserChild: PropTypes.func.isRequired,
    addScrollerChild: PropTypes.func.isRequired,
    removeScrollerChild: PropTypes.func.isRequired,

    collapserId: ofNumberTypeOrNothing,
    parentCollapserId: ofNumberTypeOrNothing,
    parentScrollerId: ofNumberTypeOrNothing,
  };


  return connect(undefined, collapserControllerActions)(WrappedCollapserController);
};

export default collapserControllerWrapper;
