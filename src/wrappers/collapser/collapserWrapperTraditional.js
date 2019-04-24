import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import forwardRefWrapper from '../../utils/forwardRef';
import { checkForRef } from '../../utils/errorUtils';
import { ofBoolTypeOrNothing, ofNumberTypeOrNothing } from '../../utils/propTypeHelpers';
import { collapserWrapperActions } from '../../actions';
// import selectors from '../../selectors';
import {
  areAllChildItemsExpanded,
  allChildItemIdsSelector,
  areAllItemsExpandedStateSelectorRoot,
  notifiedByChildSelectorSelectorRoot,
} from '../../selectors/selectorTest';

// const { allChildItemsSelector } = selectors.collapser;

export const collapserWrapper = (WrappedComponent) => {

  const WrappedComponentRef = forwardRefWrapper(WrappedComponent, 'collapserRef');

  class CollapserController extends Component {

    elem = React.createRef();

    static getDerivedStateFromProps(props, state) {
      const {
        areAllItemsExpanded,
        collapserId,
        notifiedByChild,
        notifyParentCollapser,
        parentAreAllItemsExpanded,
        parentCollapserId,
        setAllChildItemsExpanded
      } = props;
      //console.log('getDerivedStateFromProps collapserId', collapserId);
      return {};
    }

    constructor(props, context) {
      super(props, context);
      //console.log('constructor collapserId', props.collapserId);
      this.state = {
        areAllItemsExpanded: null,
        notifiedByChild: false,
        notifiedParentFromCallback: false,
      };
    }

    componentDidMount() {
      const { collapserId, watchInitCollapser } = this.props;
      //console.log('componentDidMount collapserId', collapserId);

      checkForRef(WrappedComponent, this.elem, 'collapserRef');
      watchInitCollapser(collapserId);
    }

    shouldComponentUpdate(nextProps, nextState) {
      //console.log('shouldComponentUpdate collapserId', nextProps.collapserId);

      /*

      shouldComponentUpdate used to prevent unecessary renders caused
      by the allChildItemsSelector returning an array of item objects.  If any
      item changes one of it's properties a re-render is forced on every item
      in the collapser.

      Using the entire item object made the reducers cleaner - and using just
      an array of ids had a similar problem because the selectors were creating
      arrays with distinct object ids even when equivlent.

      */
      const { props, state } = this;
      const condition = prop => (prop !== 'notifiedByChild' && prop !== 'areAllItemsExpanded' && prop !== 'allChildItems' && prop !== 'parentAreAllItemsExpanded' && props[prop] !== nextProps[prop]);
      // const condition2 = prop => (prop !== 'areAllItemsExpanded' && prop !== 'allChildItems' && state[prop] !== nextState[prop]);
      const condition3 = prop => (prop !== 'notifiedParentFromCallback' && prop !== 'notifiedByChild' && state[prop] !== nextState[prop]);
      let shouldUpdate = false;
      Object.keys(props).some(
        (prop) => {
          if (condition(prop)) {
          //console.log('should Update true prop: collapserId, prop, prev, next', props.collapserId, prop, props[prop], nextProps[prop]);
          shouldUpdate = true;
          }

        }
      );
      Object.keys(state).some(
        (prop) => {
          if (condition3(prop)) {
          //console.log('should Update true FRPM STATE: prop, prev, next', props.collapserId, prop, state[prop], nextState[prop]);
          shouldUpdate = true;
        }
      });
      // console.log('returning from shouldUPdate:', shouldUpdate);

      return true;


      /*
      return Object.keys(props).some(
        prop => (prop !== 'allChildItems' && props[prop] !== nextProps[prop])
      );
      */
    }

    getSnapshotBeforeUpdate(prevProps) {
      //console.log('getSnapshotBeforeUpdate, collapserId', prevProps.collapserId);
      return null;
    }

    componentDidUpdate(prevProps, prevState) {
      const { collapserId } = this.props;
      //console.log('componentDidUpdate, collapserId', collapserId);

    }

    getOffSetTop = () => this.elem.current.offsetTop;

    expandCollapseAll = () => {
      const {
        allChildItems,
        collapserId,
        expandCollapseAll,
        notifyParentCollapser,
        parentCollapserId,
        parentScrollerId,
        setOffsetTop,
        watchCollapser,
      } = this.props;
      const { areAllItemsExpanded } = this.props;

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
      allChildItems.forEach(([nextCollapserId, itemIdArray]) => itemIdArray.forEach(
        itemId => expandCollapseAll(areAllItemsExpanded, itemId, nextCollapserId)
      ));
/*
      if (parentCollapserId !== null) {
        notifyParentCollapser(parentCollapserId);
        //console.log('expandCollapseAll - notifying parent props.collapserId', collapserId, parentCollapserId);
        this.setState(() => ({ notifiedParentFromCallback: true }));
      }

      if (parentCollapserId === null) {
        //console.log('expandCollapseAll - notifying SELF props.collapserId', collapserId, parentCollapserId);
        this.setState(() => ({ notifiedParentFromCallback: null }));
      }
*/
    };

    render() {
      const {
        areAllItemsExpanded,
        expandCollapseAll,
        setOffsetTop,
        watchCollapser,
        watchInitCollapser,
        allChildItems,
        ...other
      } = this.props;
      // const { areAllItemsExpanded } = this.state;
      //console.log('render collapserId', this.props.collapserId);
      //console.log('');
      // debugger;
      // console.log('');
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
  };

  CollapserController.propTypes = {
    /* provided by collapserControllerWrapper */
    collapserId: ofNumberTypeOrNothing,
    parentCollapserId: ofNumberTypeOrNothing,
    parentScrollerId: PropTypes.number,

    /* provided by redux */
    areAllItemsExpanded: PropTypes.bool.isRequired, // includes item children of nested collapsers
    allChildItems: PropTypes.array.isRequired, // array of collapserItem ids
    expandCollapseAll: PropTypes.func.isRequired,
    setOffsetTop: PropTypes.func.isRequired,
    watchCollapser: PropTypes.func.isRequired,
    watchInitCollapser: PropTypes.func.isRequired,
  };

  const mapStateToProps = (state, ownProps) => {
    //console.log('mapStateToProps collapserId', ownProps.collapserId);
    const areAllItemsExpanded = () => {
      //console.log('calling areAllItemsExpanded - collapserId ', ownProps.collapserId);
      return areAllChildItemsExpanded(state, ownProps);
    };

    const parentAreAllItemsExpanded = () => {
      if (ownProps.collapserId !== null) {
        return areAllItemsExpandedStateSelectorRoot(
          state, { collapserId: ownProps.parentCollapserId }
        );
      }
      return () => null;
    };

    const notifiedByChild = () => notifiedByChildSelectorSelectorRoot(state, ownProps);

    return {
      allChildItems: allChildItemIdsSelector(state, ownProps),
      areAllItemsExpanded: areAllChildItemsExpanded(state, ownProps),
      parentAreAllItemsExpanded: areAllItemsExpandedStateSelectorRoot(
        state, { collapserId: ownProps.parentCollapserId }
      ),
      /*
      parentAreAllItemsExpandedProp: areAllItemsExpandedStateSelectorRoot(
        state, { collapserId: ownProps.parentCollapserId }
      )
      */
      notifiedByChild: notifiedByChildSelectorSelectorRoot(state, ownProps)

    };
  };

  const CollapserControllerConnect = connect(
    mapStateToProps,
    collapserWrapperActions,
  )(CollapserController);

  return CollapserControllerConnect;
};

export default collapserWrapper;
