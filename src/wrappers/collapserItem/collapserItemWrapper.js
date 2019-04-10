import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import forwardRefWrapper from '../../utils/forwardRef';
import { checkForRef } from '../../utils/errorUtils';

import { itemWrapperActions } from '../../actions';
import selectors from '../../selectors';

const { itemExpandedSelector } = selectors.collapserItem;


/*
  collapserItemWrapper is an HoC that is to be used to wrap components which make use
  of react-collapse components.

  It provides the wrapped component with the props:
    isOpened: boolean - which can be used as the <Collapse> isOpened prop.
    onHeightReady: function - which should be passed into the  <Collapse>
      onHeightReady prop.
    expandCollapse: function - which can be used as an event callback to trigger
      change of state.
*/

export const collapserItemWrapper = (WrappedComponent) => {

  const WrappedComponentRef = forwardRefWrapper(WrappedComponent, 'collapserItemRef');

  class CollapserItemController extends Component {

    elem = React.createRef();

    componentDidMount() {
      checkForRef(WrappedComponent, this.elem, 'collapserItemRef');
    }

    /*
      this.setOffsetTop: defines a callback for the saga to call that allows
        the saga to obtain the offsetTop value of the backing instance of this
        component and dispatch that to the redux store.  The saga grabs the
        offsetTop val once the onHeightReady callback has been
        called for every wrapped <Collapse> element in the Collapser.
    */
    expandCollapse = () => {
      const {
        itemId,
        expandCollapse: expandCollapseAction,
        parentScrollerId,
        parentCollapserId,
        setOffsetTop,
        watchCollapser,
      } = this.props;
      watchCollapser(parentCollapserId);
      setOffsetTop(
        () => this.elem.current.offsetTop,
        parentScrollerId,
        parentCollapserId,
      );
      expandCollapseAction(itemId);
    };

    /*
      Callback to let the collapser know that the height calculated by this
      Collapse element is ready.  The saga won't initiate the auto scroll
      unless it sees the HEIGHT_READY action.
    */
    onHeightReady = () => {
      const { itemId, heightReady, parentCollapserId } = this.props;
      heightReady(parentCollapserId, itemId);
    };


    render() {
      const {
        isOpened,
        heightReady,
        expandCollapse,
        setOffsetTop,
        watchCollapser,
        ...other
      } = this.props;
      return (
        <WrappedComponentRef
          {...other}
          isOpened={isOpened}
          expandCollapse={this.expandCollapse}
          onHeightReady={this.onHeightReady}
          ref={this.elem}
        />
      );
    }
  }

  CollapserItemController.propTypes = {
    isOpened: PropTypes.bool.isRequired,
    itemId: PropTypes.number.isRequired,
    parentCollapserId: PropTypes.number.isRequired,
    parentScrollerId: PropTypes.number.isRequired,
    heightReady: PropTypes.func.isRequired,
    expandCollapse: PropTypes.func.isRequired,
    setOffsetTop: PropTypes.func.isRequired,
    watchCollapser: PropTypes.func.isRequired,
  };

  const mapStateToProps = (state, ownProps) => ({
    isOpened: itemExpandedSelector(state)(ownProps.itemId),
  });

  const CollapserItemControllerConnect = connect(
    mapStateToProps,
    itemWrapperActions,
  )(CollapserItemController);

  return CollapserItemControllerConnect;
};

export default collapserItemWrapper;
