import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import forwardRefWrapper from '../../utils/forwardRef';
import { checkForRef } from '../../utils/errorUtils';

import { itemWrapperActions } from '../../actions';
import { getItemExpandedRoot } from '../../selectors/collapserItem';
import { getScrollerScrollOnOpenRoot, getScrollerScrollOnCloseRoot } from '../../selectors/scroller';
import { getScrollerRootNode } from '../../selectors/_reactScrollCollapse';
import { setContextAttrs } from '../../utils/objectUtils';

/*
  collapserItemWrapper is an HoC that is to be used to wrap components which make use
  of react-collapse components.

  It provides the wrapped component with the props:
    isOpened: boolean - which can be used as the <Collapse> isOpened prop.
    expandCollapse: function - which can be used as an event callback to trigger
      change of state.
*/

export const collapserItemWrapper = (WrappedComponent) => {

  const WrappedComponentRef = forwardRefWrapper(WrappedComponent, 'collapserItemRef');

  class CollapserItemController extends PureComponent {

    elem = React.createRef();

    setAttrs = (() => setContextAttrs(this))();

    componentDidMount() {
      checkForRef(WrappedComponent, this.elem, 'collapserItemRef');
    }

    expandCollapse = () => {
      const {
        addToNodeTargetArray,
        expandCollapse,
        scrollOnOpen,
        scrollOnClose,
        isOpened
      } = this.props;
      if (this.methods.scroller) {
        if ((isOpened && scrollOnClose) || (!isOpened && scrollOnOpen)) {
          this.methods.scroller.scrollToTop(this.elem.current);
        }
      }
      addToNodeTargetArray(this.parentCollapserId, this.rootNodes.collapser, true);
      expandCollapse(this.id, this.parentCollapserId);
      this.methods.collapser.initiateTreeStateCheck(false, false);
    };

    render() {
      const { isOpened, expandCollapse, ...other } = this.props;
      return (
        <WrappedComponentRef
          {...other}
          isOpened={isOpened}
          expandCollapse={this.expandCollapse}
          ref={this.elem}
        />
      );
    }
  }

  CollapserItemController.defaultProps = {};

  CollapserItemController.propTypes = {
    addToNodeTargetArray: PropTypes.func.isRequired,
    isOpened: PropTypes.bool.isRequired,
    expandCollapse: PropTypes.func.isRequired,
    scrollOnOpen: PropTypes.bool.isRequired,
    scrollOnClose: PropTypes.bool.isRequired,
  };

  CollapserItemController.whyDidYouRender = {
    logOnDifferentValues: false,
    customName: 'CollapserItemController'
  };

  const mapStateToProps = (state, ownProps) => ({
    isOpened: getItemExpandedRoot(state)(ownProps._reactScrollCollapse.id),
    scrollOnOpen: getScrollerScrollOnOpenRoot(state)(getScrollerRootNode(ownProps)),
    scrollOnClose: getScrollerScrollOnCloseRoot(state)(getScrollerRootNode(ownProps)),
  });

  const CollapserItemControllerConnect = connect(
    mapStateToProps,
    itemWrapperActions,
  )(CollapserItemController);

  return CollapserItemControllerConnect;
};

export default collapserItemWrapper;
