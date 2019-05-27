import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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

    /*
      After mounting a bunch of nodes we need to check state - but this method
      only does that on mount of first render of the current root node.  Otherwise
      it just logs the children mounted and the state check is initiated from
      componentDidUpdate.

      Children mount first so they are added to the targetArray of nodes
      needing to be checked.

      WHen we hit the root node we check state.

      treeIds are naively regenerated on every mount.  Need to test doing this
      after root mount only.

      Also - the nodeTargetArray is reset - but not sure why it's before
      the check tree state.  On mount it probably doesn't matter anyway.
    */
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

      // addToNodeTargetArray(addNodeValue, rootNodeId);
      if (!isRootNode) {
        addToNodeTargetArray(collapserId, rootNodeId);
      }
      if (isRootNode) {
        // const addNodeValue = isRootNode ? null : collapserId;
        selectors.setTreeIds(setTreeId);
        console.log('toggling checkstate from didMount - id: ', collapserId);
        addToNodeTargetArray(null, rootNodeId);
        toggleCheckTreeState(rootNodeId);
      }
    }

    /*
      Not sure what is gauranteeing the state update after children mounting.
      Need to investigate further.
    */
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
        console.log('toggling checkstate from didUpdate - id: ', collapserId);
        // toggleCheckTreeState(rootNodeId);
        addToNodeTargetArray(null, rootNodeId);
      }
    }


    /*
      This strategy here is designed to limit the number of state checks
      when unmounting.  The idea was that the parent node has its willUnmount
      method before it's children.  So we could update state with a list of the
      children left to unmount - and then check when the last child is about
      to unmount themselves - and then notify to check state.

      It would still require a state check for each parent node being unmounted
      in a single render cycle.  But better than doing it for all the children too.

      Problem is that willUnmount is called before previous state updates in a render
      cycle are pushed through to the component.  So when the child checks
      to see if it needs to be removed it has an old copy of state and is not
      in the unmountArray.

      THe hack below uses redux-thunks to get access to the getState() function
      passed into async action creators - and get fresh state.

      Nasty... gonna try something else anyway.

      Also had to move the removeCollapser logic down from the collapserControllerWrapper
      Because that would all get processed before we could detect the current children.
      The children would all be removed from state before this component had
      actually unmounted.  Good argument for moving that logic down here and removing
      that wrapper altogether - although that separation has proven useful.
    */
    componentWillUnmount() {
      const {
        addToUnmountArray,
        removeFromUnmountArray,
        rootNodeId,
        selectors: { childCollapsers, unmountArray },
        toggleCheckTreeState,
        dispatch
      } = this.props;

      /* the get fresh strate hack */
      let newState;
      const blah = dispatch((arg, getState) => {
        newState = getState();
        return { type: 'blah' };
      });

      const { removeCollapser } = this.props;
      const { collapserId, parentCollapserId, parentScrollerId } = this.props;

      const children = childCollapsers();

      /*
        the array of children currently waiting to be unmounted.  Taken from
        fresh state yet to be pushed to the component instance.  ick.
      */
      const unmountChildren = getRootUnmountArrayRoot(newState)(rootNodeId);

      const filteredUnmountChildren = unmountChildren.filter(id => (id !== collapserId));

      /*
        if we have no children to unmount and we're the last to unmount.
        Then go ahead and remove from state and initiate check of tree state.
        Make sure the order of these two are preserved,  Mapdispatch is
        called immediately after both so the state check of the tree needs
        to happen after the children are removed from state.
      */
      if (children.length === 0 && filteredUnmountChildren.length === 0) {
        removeCollapser(parentScrollerId, parentCollapserId, collapserId);
        toggleCheckTreeState(rootNodeId);
      }

      /* more children to unmount - add em! */
      if (children.length > 0) {
        addToUnmountArray(children, rootNodeId);
      }

      /* Remove from the array to keep track of what is left to unmount */
      if (unmountChildren.includes(collapserId)) {
        removeFromUnmountArray(collapserId, rootNodeId);
      }

      /*
        Another problematic aspect to this approach is that it's kinda hard
        to tell when this is needed exactly.  Not even sure if this gets called
        after removeCollapser is called above - I got lost following the execution
        flow.  IT must right?  So calling it twice can't be good... but haven't
        sussed exact conditions.  Too much complexity anyway.
      */
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
    /* part of the getState hack for component unmounting. */
    (dispatch, getState) => ({ ...bindActionCreators({ ...collapserWrapperActions }, dispatch), dispatch }),
  )(CollapserController);

  return CollapserControllerConnect;
};

export default collapserWrapper;
