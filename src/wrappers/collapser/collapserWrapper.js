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
      console.log('getDerivedStateFromProps - CollapserController - collapserId, props, state', props.collapserId, props, state);
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

    constructor(props) {
      super(props);
      console.log('CollapserController this constructor', this);
      console.log('constructor - CollapserController - collapserId, props', props.collapserId, props);
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
        watchInitCollapser
      } = this.props;
      const { props, state } = this;
      console.log('componentDidMount - CollapserController - collapserId, props, state', props.collapserId, props, state);

      checkForRef(WrappedComponent, this.elem, 'collapserRef');
      watchInitCollapser(collapserId);

      /*
        On insertion of new node - we shouldn't check unrelated branches - so set this.
      */
      const addNodeValue = isRootNode ? null : collapserId;
      addToNodeTargetArray(addNodeValue, getRootNodeId(this.props));
      props.setTreeIdsSelector(props.setTreeId);
    }

    shouldComponentUpdate(nextProps, nextState) {
      const { props, state } = this;
      console.log('shouldComponentUpdate - CollapserController - collapserId, props, state', props.collapserId, props, state);
      const checkAgainstProps = ['rootNodeId', 'setTreeIds', 'allChildItemIds', 'nodeTargetArray',
        'areAllItemsExpandedSelector', 'setTreeIdsSelector'];

      const propsCondition = (prop, stateCheckValue) => {
        /*
        if (props.collapserId === 0 && prop === 'nodeTargetArray') {
          debugger;
        }
        */
        const left = !checkAgainstProps.includes(prop) && props[prop] !== nextProps[prop];
        const right = prop === 'nodeTargetArray' && !compareIntArrays(props[prop], nextProps[prop]) && stateCheckValue;
        const final = left || right;
        return final;
      };

      const stateCondition = prop => (state[prop] !== nextState[prop]);
      const stateCheckValue = Object.keys(state).some(prop => stateCondition(prop));

      /*
      const shouldUpdate = Object.keys(props).some(prop => propsCondition(prop, stateCheckValue))
       || stateCheckValue;

      if (shouldUpdate) {
        whyUpdate(props, nextProps, 'CollapserController - props',
          props.collapserId, checkAgainstProps);
        whyUpdate(state, nextState, 'CollapserController - state', props.collapserId);
      }
      return shouldUpdate;
      */

      return Object.keys(props).some(prop => propsCondition(prop, stateCheckValue))
       || stateCheckValue;
    }

    componentDidUpdate() {
      const { props, state } = this;
      console.log('componentDidUpdate - CollapserController - collapserId, props, state', props.collapserId, props, state);

    }

    componentWillUnmount() {
      const { props, state } = this;
      console.log('componentWillUnmount - CollapserController - collapserId, props, state', props.collapserId, props, state);
    }

    getOffSetTop = () => this.elem.current.offsetTop;

    expandCollapseAll = () => {
      const {
        allChildItemIds,
        collapserId,
        expandCollapseAll,
        parentScrollerId,
        setOffsetTop,
        addToNodeTargetArray,
        watchCollapser,
        isRootNode,
      } = this.props;
      const { areAllItemsExpanded } = this.state;
      /*
        This activates a saga that will ensure that all the onHeightReady
        callbacks of nested <Collapse> elements have fired - before dispatching
        a HEIGHT_READY action.  Previously scroller would wait for this.
      */
      watchCollapser(collapserId);

      /*
        setOffsetTop: defines a callback for the saga to call that allows
        the saga to obtain the offsetTop value of the backing instance of this
        component and dispatch that to the redux store.
      */
      setOffsetTop(
        this.getOffSetTop,
        parentScrollerId,
        collapserId,
      );
      allChildItemIds().forEach(itemId => expandCollapseAll(areAllItemsExpanded, itemId));
      if (!isRootNode) {
        addToNodeTargetArray(collapserId, getRootNodeId(this.props));
      }
    };

    render() {
      const { props, state } = this;
      console.log('render - CollapserController - collapserId, props, state', props.collapserId, props, state);
      console.log('');

      const {
        expandCollapseAll,
        setOffsetTop,
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
    setOffsetTop: PropTypes.func.isRequired,
    watchCollapser: PropTypes.func.isRequired,
    watchInitCollapser: PropTypes.func.isRequired,
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
