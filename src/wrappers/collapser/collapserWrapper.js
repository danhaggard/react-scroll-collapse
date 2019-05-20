import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import forwardRefWrapper from '../../utils/forwardRef';
import { checkForRef } from '../../utils/errorUtils';
import { ofNumberTypeOrNothing } from '../../utils/propTypeHelpers';
import { collapserWrapperActions } from '../../actions';

import { getNodeTargetArrayRoot } from '../../selectors/rootNode';
import {
  nestedCollapserItemsRoot,
  nestedCollapserItemsExpandedRootEvery,
  setTreeIdsRecursively,
} from '../../selectors/collapser';

import {
  compareIntArrays,
  getCache,
  getRootNodeId,
} from '../utils';

export const collapserWrapper = (WrappedComponent) => {

  const WrappedComponentRef = forwardRefWrapper(WrappedComponent, 'collapserRef');

  class CollapserController extends Component {

    elem = React.createRef();

    static getDerivedStateFromProps(props, state) {
      const {
        areAllItemsExpandedSelector,
        collapserId,
        nodeTargetArray,
        isRootNode,
        addToNodeTargetArray,
      } = props;
      let areAllItemsExpandedUpdate = state.areAllItemsExpanded;
      if (isRootNode) {
        state.cache.unlockCache();
        areAllItemsExpandedUpdate = areAllItemsExpandedSelector(nodeTargetArray, state.cache);
        state.cache.lockCache();
        if (nodeTargetArray.length > 0) {
          addToNodeTargetArray(null, collapserId);
        }
      } else {
        areAllItemsExpandedUpdate = areAllItemsExpandedSelector([collapserId], state.cache);
      }
      return {
        areAllItemsExpanded: areAllItemsExpandedUpdate,
      };
    }

    state = {
      areAllItemsExpanded: null,
      cache: getCache(this.props),
    };

    componentDidMount() {
      const {
        addToNodeTargetArray,
        collapserId,
        isRootNode,
        setTreeId,
        setTreeIdsSelector,
        watchInitCollapser
      } = this.props;
      checkForRef(WrappedComponent, this.elem, 'collapserRef');
      watchInitCollapser(collapserId);

      /*
        On insertion of new node - we shouldn't check unrelated branches - so set this.
      */
      const addNodeValue = isRootNode ? null : collapserId;
      addToNodeTargetArray(addNodeValue, getRootNodeId(this.props));
      setTreeIdsSelector(setTreeId);
    }

    shouldComponentUpdate(nextProps, nextState) {
      const { props, state } = this;
      const checkAgainstProps = ['rootNodeId', 'setTreeIds', 'setTreeId', 'allChildItemIds', 'nodeTargetArray',
        'areAllItemsExpandedSelector', 'setTreeIdsSelector'];

      const propsCondition = (prop, stateCheckValue) => {
        const left = !checkAgainstProps.includes(prop) && props[prop] !== nextProps[prop];
        const right = prop === 'nodeTargetArray' && !compareIntArrays(props[prop], nextProps[prop]) && stateCheckValue;
        return left || right;
      };

      const stateCondition = prop => (state[prop] !== nextState[prop]);
      const stateCheckValue = Object.keys(state).some(prop => stateCondition(prop));

      return Object.keys(props).some(prop => propsCondition(prop, stateCheckValue))
       || stateCheckValue;
    }

    expandCollapseAll = () => {
      const {
        allChildItemIds,
        collapserId,
        expandCollapseAll,
        addToNodeTargetArray,
        watchCollapser,
        isRootNode,
        contextMethods: { scrollToTop }
      } = this.props;
      const { areAllItemsExpanded } = this.state;
      /*
        This activates a saga that will ensure that all the onHeightReady
        callbacks of nested <Collapse> elements have fired - before dispatching
        a HEIGHT_READY action.  Previously scroller would wait for this.
      */
      watchCollapser(collapserId);
      scrollToTop(this.elem.current);
      allChildItemIds().forEach(itemId => expandCollapseAll(areAllItemsExpanded, itemId));
      if (!isRootNode) {
        addToNodeTargetArray(collapserId, getRootNodeId(this.props));
      }
    };

    render() {
      const {
        expandCollapseAll,
        watchCollapser,
        watchInitCollapser,
        allChildItemIds,
        ...other
      } = this.props;
      const { areAllItemsExpanded } = this.state;
      return (
        <WrappedComponentRef
          {...other}
          ref={this.elem}
          expandCollapseAll={this.expandCollapseAll}
          areAllItemsExpanded={areAllItemsExpanded}
        />
      );
    }
  }

  CollapserController.defaultProps = {
    collapserId: null,
    parentCollapserId: null,
    parentScrollerId: null,
    rootNodes: {},
  };

  CollapserController.propTypes = {
    /* provided by collapserControllerWrapper */
    collapserId: ofNumberTypeOrNothing,
    parentCollapserId: ofNumberTypeOrNothing,
    parentScrollerId: PropTypes.number,
    isRootNode: PropTypes.bool.isRequired,
    providerType: PropTypes.string.isRequired,
    rootNodes: PropTypes.object,

    /* provided by redux */
    addToNodeTargetArray: PropTypes.func.isRequired,
    areAllItemsExpandedSelector: PropTypes.func.isRequired, // includes nested
    allChildItemIds: PropTypes.func.isRequired, // array of collapserItem ids
    expandCollapseAll: PropTypes.func.isRequired,
    setTreeId: PropTypes.func.isRequired,
    setTreeIdsSelector: PropTypes.func.isRequired,
    watchCollapser: PropTypes.func.isRequired,
    watchInitCollapser: PropTypes.func.isRequired,

    /* provided by scrollerProvider via context */
    contextMethods: PropTypes.object.isRequired,
  };

  const mapStateToProps = (state, ownProps) => {

    const areAllItemsExpandedSelector = (
      targetNodeArray,
      collapserCache
    ) => nestedCollapserItemsExpandedRootEvery(
      state, { ...ownProps, targetNodeArray }, collapserCache
    );

    return {
      allChildItemIds: () => nestedCollapserItemsRoot(state, ownProps),
      areAllItemsExpandedSelector,
      setTreeIdsSelector: action => setTreeIdsRecursively(state, ownProps.rootNodeId, action),
      nodeTargetArray: getNodeTargetArrayRoot(state)(ownProps.rootNodeId),
    };
  };

  const CollapserControllerConnect = connect(
    mapStateToProps,
    collapserWrapperActions,
  )(CollapserController);

  return CollapserControllerConnect;
};

export default collapserWrapper;
