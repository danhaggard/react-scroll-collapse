import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import forwardRefWrapper from '../../utils/forwardRef';
import { checkForRef } from '../../utils/errorUtils';

import { itemWrapperActions } from '../../actions';
import { getItemExpandedRoot } from '../../selectors/collapserItem';
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
      const { addToNodeTargetArray, expandCollapse } = this.props;
      if (this.methods.scroller) {
        this.methods.scroller.scrollToTop(this.elem.current);
      }
      expandCollapse(this.id, this.parentCollapserId);
      addToNodeTargetArray(this.parentCollapserId, this.rootNodes.collapser);
      debugger;
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
  };

  CollapserItemController.whyDidYouRender = {
    logOnDifferentValues: false,
    customName: 'CollapserItemController'
  };

  const mapStateToProps = (state, ownProps) => ({
    isOpened: getItemExpandedRoot(state)(ownProps._reactScrollCollapse.id),
  });

  const CollapserItemControllerConnect = connect(
    mapStateToProps,
    itemWrapperActions,
  )(CollapserItemController);

  return CollapserItemControllerConnect;
};

export default collapserItemWrapper;
