import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ofNumberTypeOrNothing } from '../../utils/propTypeHelpers';
import { collapserControllerActions } from '../../actions';
import cleanHoCProps from '../../utils/cleanHoCProps';


export const collapserControllerWrapper = (CollapserController) => {

  class WrappedCollapserController extends Component {

    static getDerivedStateFromProps(props, state) {
      console.log('getDerivedStateFromProps - WrappedCollapserController - collapserId, props, state', props.collapserId, props, state);
      return state;
    }

    componentDidMount() {
      const { props, state } = this;
      console.log('componentDidMount - WrappedCollapserController - collapserId, props, state', props.collapserId, props, state);
      // console.log('');

    }

    shouldComponentUpdate(nextProps, nextState) {
      const { props, state } = this;
      console.log('shouldComponentUpdate - WrappedCollapserController - collapserId, props, state', props.collapserId, props, state);
      return true;
    }

    componentDidUpdate() {
      const { props, state } = this;
      console.log('componentDidUpdate - WrappedCollapserController - collapserId, props, state', props.collapserId, props, state);
    }

    getRootNodeId = () => { // eslint-disable-line react/sort-comp
      const {
        isRootNode,
        collapserId,
        rootNodes,
        providerType
      } = this.props;
      return isRootNode ? collapserId : rootNodes[providerType];
    }

    constructor(props) { // eslint-disable-line react/sort-comp
      super(props);
      console.log('WrappedCollapserController this constructor', this);
      console.log('constructor - WrappedCollapserController - collapserId, props', props.collapserId, props);
      this.addCollapser();
      this.addRootNode();
      this.state = {};
    }

    componentWillUnmount() {
      const { props, state } = this;
      console.log('componentWillUnmount - WrappedCollapserController - collapserId, props, state', props.collapserId, props, state);
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
        addRootNode(this.getRootNodeId());
      }
    }

    removeRootNode() {
      const { removeRootNode, isRootNode } = this.props;
      if (isRootNode) {
        removeRootNode(this.getRootNodeId());
      }
    }

    render() {
      const { props, state } = this;
      console.log('render - WrappedCollapserController - collapserId, props, state', props.collapserId, props, state);
      console.log('');

      const { collapserId, parentScrollerId } = this.props;
      if (collapserId >= 0 && parentScrollerId >= 0) {
        return (
          <CollapserController
            rootNodeId={this.getRootNodeId()}
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
