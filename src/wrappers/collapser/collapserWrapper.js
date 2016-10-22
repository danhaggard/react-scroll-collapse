import React, {PropTypes, Component} from 'react';
import ReactDOM from 'react-dom';
import isEqual from 'lodash/isEqual';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {setOffsetTop, expandCollapseAll} from '../../actions';

import selectors from '../../selectors';
const {allChildItemsSelector, areAllItemsExpandedSelector} = selectors.collapser;

/*
  collapseWrapper is an HoC that is to be used to wrap components which make use
  of react-collapse components.  (although it could be used with others conceivably)

  It provides the wrapped component with the props:
    isOpened: boolean - which can be used as the <Collapse> isOpened prop.
    onHeightReady: function - which should be passed into the  <Collapse>
      onHeightReady prop.
    expandCollapse: function - which can be used as an event callback to trigger
      change of state.
*/
export const collapserWrapper = (WrappedComponent) => {

  class CollapserController extends Component {

    static propTypes = {
      /* provided by collapserControllerWrapper */
      collapserId: PropTypes.number.isRequired,

      /* provided by redux */
      areAllItemsExpanded: PropTypes.bool,
      allChildItems: PropTypes.array,
      actions: PropTypes.object,
    }

    constructor(props) {
      super(props);
      /*
        this.setOffsetTop: defines a callback for the saga to call that allows
          the saga to obtain the offsetTop value of the backing instance of this
          component and dispatch that to the redux store.  The saga grabs the
          offsetTop val once the onHeightReady callback has been
          called for every wrapped <Collapse> element in the Collapser.
      */
      this.expandCollapseAll = (allChildItems, areAllItemsExpanded) => () => {
        this.props.actions.setOffsetTop(() => this.elem.offsetTop);
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
      the function on render - which are gauranteed to be up to date.
    */

    componentDidMount() {
      this.elem = ReactDOM.findDOMNode(this);
    }

    /*
      This is necesssary at the moment to prevent unecessary renders caused
      by the allChildItemsSelector returning an array.  The array is a different
      object no matter what so reselect doesn't memoize it.  I did try a quick
      fix of replacing createSelector's identity function to the lodash isEqual,
      but no luck.  Requires either different memoization function or better
      selector composition to match reselect docs.  Might not be worth
      the performance gain either way.

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
      const {allChildItems, areAllItemsExpanded, ...other} = this.props;
      return (
        <WrappedComponent
          {...other}
          expandCollapseAll={this.expandCollapseAll(allChildItems, areAllItemsExpanded).bind(this)}
          areAllItemsExpanded={areAllItemsExpanded}
        />
      );
    }
  }

  const mapStateToProps = (state, ownProps) => ({
    allChildItems: allChildItemsSelector(state)(ownProps.collapserId),
    areAllItemsExpanded: areAllItemsExpandedSelector(state)(ownProps.collapserId),
  });

  const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
      setOffsetTop,
      expandCollapseAll,
    }, dispatch),
  });

  const CollapserControllerConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
  )(CollapserController);

  return CollapserControllerConnect;
};
