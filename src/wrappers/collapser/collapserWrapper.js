import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'

import forwardRefWrapper from '../../utils/forwardRef';
import { checkForRef } from '../../utils/errorUtils';
import { ofNumberTypeOrNothing, ofObjectTypeOrNothing } from '../../utils/propTypeHelpers';
import { collapserWrapperActions } from '../../actions';

import { getNodeTargetArrayRoot, getCheckTreeStateRoot, getRootUnmountArrayRoot } from '../../selectors/rootNode';
import {
  createAreAllItemsExpandedSelector,
  getCollapserCollapsersRoot,
  nestedCollapserItemsRoot,
  setTreeIdsRecursively,
} from '../../selectors/collapser';

import addLoggingDefaultsToComponent from '../../utils/logging/utils';


export const collapserWrapper = (WrappedComponent) => {

  const WrappedComponentRef = forwardRefWrapper(WrappedComponent, 'collapserRef');

  class CollapserController extends Component {

    elem = React.createRef();

    componentDidMount() {
      const {
        addToNodeTargetArray,
        collapserId,
        isRootNode,
        rootNodeId,
        setTreeId,
        selectors,
        toggleCheckTreeState,
      } = this.props;
      checkForRef(WrappedComponent, this.elem, 'collapserRef');
      /*
        On insertion of new node - we shouldn't check unrelated branches - so set this.
      */
      const addNodeValue = isRootNode ? null : collapserId;
      addToNodeTargetArray(addNodeValue, rootNodeId);
      selectors.setTreeIds(setTreeId);
      if (isRootNode) {
        toggleCheckTreeState(rootNodeId);
      }
    }

    componentDidUpdate() {
      const {
        addToNodeTargetArray,
        collapserId,
        rootNodeId,
        selectors,
        toggleCheckTreeState
      } = this.props;
      const targetArray = selectors.nodeTargetArray();
      if (targetArray.includes(collapserId)) {
        toggleCheckTreeState(rootNodeId);
        addToNodeTargetArray(null, rootNodeId);
      }
    }

    componentWillUnmount() {
      const {
        addToUnmountArray,
        removeFromUnmountArray,
        rootNodeId,
        selectors: { childCollapsers, unmountArray },
        toggleCheckTreeState,
        dispatch
      } = this.props;
      let newState;
      const blah = dispatch((a, b) => {
        newState = b();
        return { type: 'blah' };
      });

      const { removeCollapser } = this.props;
      const { collapserId, parentCollapserId, parentScrollerId } = this.props;

      const children = childCollapsers();
      const unmountChildren = getRootUnmountArrayRoot(newState)(rootNodeId);
      const filteredUnmountChildren = unmountChildren.filter(id => (id !== collapserId));
      if (children.length === 0 && filteredUnmountChildren.length === 0) {
        removeCollapser(parentScrollerId, parentCollapserId, collapserId);
        toggleCheckTreeState(rootNodeId);
      }
      if (children.length > 0) {
        addToUnmountArray(children, rootNodeId);
      }
      if (unmountChildren.includes(collapserId)) {
        removeFromUnmountArray(collapserId, rootNodeId);
      }
      removeCollapser(parentScrollerId, parentCollapserId, collapserId);
    }

    expandCollapseAll = () => {
      const {
        addToNodeTargetArray,
        areAllItemsExpanded,
        collapserId,
        contextMethods,
        expandCollapseAll,
        isRootNode,
        rootNodeId,
        selectors,
      } = this.props;

      if (contextMethods.scroller) {
        contextMethods.scroller.scrollToTop(this.elem.current);
      }
      expandCollapseAll(areAllItemsExpanded, selectors.allChildItemIds(), rootNodeId);
      if (!isRootNode) {
        addToNodeTargetArray(collapserId, rootNodeId, true);
      } else {
        addToNodeTargetArray(null, rootNodeId);
      }
    };

    render() {
      const {
        areAllItemsExpanded,
        expandCollapseAll,
        rootNodeId,
        selectors,
        ...other
      } = this.props;
      console.log('collapserRender', this.props.collapserId);
      /*
      if (this.props.collapserId === 0) {
        renderCount += 1;
        console.log('root rendercount:', renderCount);
      }
      */
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
    contextMethods: null,
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
    rootNodes: PropTypes.object,

    /* provided by redux */
    addToNodeTargetArray: PropTypes.func.isRequired,
    areAllItemsExpanded: PropTypes.bool.isRequired,
    expandCollapseAll: PropTypes.func.isRequired,
    selectors: PropTypes.object.isRequired, // includes nested
    setTreeId: PropTypes.func.isRequired,
    toggleCheckTreeState: PropTypes.func.isRequired,

    /* provided by scrollerProvider via context */
    contextMethods: ofObjectTypeOrNothing,
    rootNodeId: PropTypes.number.isRequired,
  };

  addLoggingDefaultsToComponent(
    CollapserController,
    'CollapserController',
    [
      ['nodeTargetArray', 'deepEquals'],
      ['areAllItemsExpandedSelector', 'function'],
      ['setTreeIdsSelector', 'function'],
      ['allChildItemIds', 'function'],
    ]
  );


  /*
    Overall strategy is to prevent mapStateToProps from calling most selectors
    directly because they are expensive calls - and we want to maintain tight
    control over how they are called.  So they are passed in as functions to props
    and the component calls them when required.  On each call of mapStateToProps
    - new selector functions are generated with fresh props and state injected
    into them.

    These functions would ordinarily cause redux to see a change in value,
    and thus trigger an update to the component on every dispatch -
    because they are new functions every time mapStateToProps is called.

    So we created a selectors object with a closure - which is mutated with
    the new selector functions.  The identity of this object never changes
    and never causes unecesary component updates.

    areAllItemsExpanded is different.  Previously I was passing in this as a
    selector function as well and actually relying on the selector functions
    failing the identity check to force the component update on every call of
    mapStateToProps.  I would then use a combination of getDerivedStateFromProps
    and shouldComponentUpdate, to determine when component updates would happen.

    This was bad because redux is calling setState on every component instance,
    on every change of redux state - but in many cases WITHOUT causing a render
    in the Collapser instance because renders were being blocked by
    componentShouldUpdate.  On a tree with a nesting depth > 50 - the redux
    calls to setState would exceed 50 in a single render cycle and so react
    would think it was in a infinite setState loop and terminate.

    Now - areAllItemsExpanded simply passes a true false value - and is responsible
    for triggering component updates.  Because checking this state is the most
    expensive - a new strategy had to be employed to ensure it is called
    only when necessary.  See comments on: createAreAllItemsExpandedSelector
    for details.
  */

  const mapStateToPropsFactory = () => {
    const selectors = {};
    const areAllItemsExpandedSelector = createAreAllItemsExpandedSelector(
      getCheckTreeStateRoot,
      getNodeTargetArrayRoot,
    );
    debugger;
    return (state, props) => {
      const { collapserId, rootNodeId } = props;
      selectors.allChildItemIds = () => nestedCollapserItemsRoot(state, props);
      selectors.childCollapsers = () => getCollapserCollapsersRoot(state)(collapserId);
      selectors.nodeTargetArray = () => getNodeTargetArrayRoot(state)(rootNodeId);
      selectors.unmountArray = () => getRootUnmountArrayRoot(state)(rootNodeId);
      selectors.setTreeIds = action => setTreeIdsRecursively(
        state,
        rootNodeId,
        action
      );
      return {
        areAllItemsExpanded: areAllItemsExpandedSelector(state, props),
        selectors,
      };
    };
  };

  const CollapserControllerConnect = connect(
    mapStateToPropsFactory,
    (dispatch, getState) => ({ ...bindActionCreators({ ...collapserWrapperActions }, dispatch), dispatch }),
  )(CollapserController);

  return CollapserControllerConnect;
};

export default collapserWrapper;
