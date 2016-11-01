import React, {PropTypes, Component} from 'react';
import ReactDOM from 'react-dom';
import isEqual from 'lodash/isEqual';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {watchCollapser, watchInitCollapser,
  setOffsetTop, expandCollapseAll} from '../../actions';

import selectors from '../../selectors';
const {allChildItemsSelector, areAllItemsExpandedSelector} = selectors.collapser;


export const collapserWrapper = (WrappedComponent) => {

  class CollapserController extends Component {

    constructor(props) {
      super(props);
      this.expandCollapseAll = (allChildItems, areAllItemsExpanded) => () => {
        /*
          setOffsetTop: defines a callback for the saga to call that allows
          the saga to obtain the offsetTop value of the backing instance of this
          component and dispatch that to the redux store.  The saga grabs the
          offsetTop val once the onHeightReady callback has been
          called for every wrapped <Collapse> element in the Collapser.
        */
        this.props.actions.watchCollapser(this.props.collapserId);
        this.props.actions.setOffsetTop(
          () => this.elem.offsetTop,
          this.props.parentScrollerId,
          this.props.collapserId,
        );
        this.props.actions.expandCollapseAll(allChildItems, areAllItemsExpanded);
      };
    }

    /*
      allChildItems, areAllItemsExpanded are passed into the expandCollapseAll
      callback at render - to ensure allChildItems have been initialised in redux..

      allChildItems starts out as an empty array on first render because the
      child collapsers haven't initialised yet.

      If the expandCollapse part of this callBack is defined in mapDispatchToProps
      using own props - e.g.: {
        expandCollapseAll: () => expandedCollapseAll(ownProps.allChildItems,
          ownProps.areAllItemsExpanded),
        }
      ...it will only use the props values as supplied on the first render - i.e.
      the empty array for allChildItems.  So instead - those values are passed into
      the function in render - which are gauranteed to be up to date.

      The tradeoff is that this causes double render on init.  I don't see any
      way around this.
    */

    componentDidMount() {
      this.elem = ReactDOM.findDOMNode(this);
      this.props.actions.watchInitCollapser(this.props.collapserId);
    }

    /*
      shouldComponentUpdate is necesssary at the moment to prevent unecessary renders caused
      by the allChildItemsSelector returning an array.  The array is a different
      object no matter what so reselect doesn't memoize it.  I did try a quick
      fix of replacing createSelector's identity function to the lodash isEqual,
      but no luck.  Probably will require either different memoization function
      or better selector composition to match reselect docs.

      the should component update solution below is stopgap.
    */
    shouldComponentUpdate(nextProps) {
      let shouldUpdate = true;
      // don't update if the two arrays have the same ids...
      shouldUpdate = !isEqual(this.props.allChildItems, nextProps.allChildItems);
      if (!shouldUpdate) {
        // unless some other prop has changed...
        Object.keys(this.props).forEach(prop => {
          if (prop !== 'allChildItems' && this.props[prop] !== nextProps[prop]) {
            shouldUpdate = true;
          }
        });
      }
      return shouldUpdate;
    }

    render() {
      const {actions, allChildItems, areAllItemsExpanded, ...other} = this.props;
      const expandCollapseAllBind = !this.expandCollapseAll ? null :
        this.expandCollapseAll(allChildItems, areAllItemsExpanded);
      return (
        <WrappedComponent
          {...other}
          expandCollapseAll={expandCollapseAllBind}
          areAllItemsExpanded={areAllItemsExpanded}
        />
      );
    }
  }

  CollapserController.propTypes = {
    /* provided by collapserControllerWrapper */
    collapserId: PropTypes.number.isRequired,
    parentCollapserId: PropTypes.number,
    parentScrollerId: PropTypes.number.isRequired,

    /* provided by redux */
    areAllItemsExpanded: PropTypes.bool, // includes item children of nested collapsers
    allChildItems: PropTypes.array, // array of collapserItem ids
    actions: PropTypes.object,
  };

  const mapStateToProps = (state, ownProps) => ({
    allChildItems: allChildItemsSelector(state)(ownProps.collapserId),
    areAllItemsExpanded: areAllItemsExpandedSelector(state)(ownProps.collapserId),
  });

  const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
      setOffsetTop,
      expandCollapseAll,
      watchCollapser,
      watchInitCollapser,
    }, dispatch),
  });

  const CollapserControllerConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
  )(CollapserController);

  return CollapserControllerConnect;
};
