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

      BUT this means that you are generating a new function on every render and
      passing into props - forcing child renders.  Figure out fix.
    */

    componentDidMount() {
      const domNode = this.getWrappedDomNode();
      this.expandCollapseAll = (allChildItems, areAllItemsExpanded) => () => {
        /*
          this.setOffsetTop: defines a callback for the saga to call that allows
            the saga to obtain the offsetTop value of the backing instance of this
            component and dispatch that to the redux store.  The saga grabs the
            offsetTop val once the onHeightReady callback has been
            called for every wrapped <Collapse> element in the Collapser.
        */
        this.props.actions.setOffsetTop(
          () => domNode.offsetTop,
          this.props.parentScrollerId,
          this.props.collapserId,
        );
        this.props.actions.expandCollapseAll(allChildItems, areAllItemsExpanded);
      };
    }

    /*
      This is necesssary at the moment to prevent unecessary renders caused
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

    getWrappedDomNode() {
      /*
        isInAnyDOM tests whether an object is a DOM object.
        taken from here: http://stackoverflow.com/a/20476546/1914452
      */
      const isInAnyDOM = (o) => (o !== null) &&
        !!(o.ownerDocument && (o.ownerDocument.defaultView || o.ownerDocument.parentWindow).alert);
      let domNode;
      if (!isInAnyDOM(this.elem)) {
        domNode = ReactDOM.findDOMNode(this.elem);
      } else {
        domNode = this.elem;
      }
      return domNode;
    }

    render() {
      const {actions, allChildItems, areAllItemsExpanded, ...other} = this.props;
      const expandCollapseAllBind = !this.expandCollapseAll ? null :
        this.expandCollapseAll(allChildItems, areAllItemsExpanded);
      return (
        <WrappedComponent
          {...other}
          ref={
            elem => {
              this.elem = elem;
            }
          }
          expandCollapseAll={expandCollapseAllBind}
          areAllItemsExpanded={areAllItemsExpanded}
        />
      );
    }
  }

  CollapserController.propTypes = {
    /* provided by collapserControllerWrapper */
    collapserId: PropTypes.number.isRequired,
    parentScrollerId: PropTypes.number.isRequired,

    /* provided by redux */
    areAllItemsExpanded: PropTypes.bool,
    allChildItems: PropTypes.array,
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
    }, dispatch),
  });

  const CollapserControllerConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
  )(CollapserController);

  return CollapserControllerConnect;
};
