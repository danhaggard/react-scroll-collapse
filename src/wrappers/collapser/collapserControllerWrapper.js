import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ofNumberTypeOrNothing } from '../../utils/propTypeHelpers';
import { collapserControllerActions } from '../../actions';
import cleanHoCProps from '../../utils/cleanHoCProps';
import { removeSelector } from '../../selectors/selectorCache';

export const collapserControllerWrapper = (CollapserController) => {

  class WrappedCollapserController extends Component {

    constructor(props) {
      super(props);
      this.addCollapser();
    }

    componentWillUnmount() {
      const {
        cleanUpCache,
        removeCollapserChild,
        removeScrollerChild,
        removeCollapser
      } = this.props;
      const { collapserId, parentCollapserId, parentScrollerId } = this.props;
      if (parentCollapserId >= 0) {
        removeCollapserChild(parentCollapserId, collapserId);
      }
      if (parentScrollerId >= 0) {
        removeScrollerChild(parentScrollerId, collapserId);
      }
      removeCollapser(parentCollapserId, parentScrollerId, collapserId);

      /*
        Cleans up any external caching used for this collapser instance.
      */
      cleanUpCache(collapserId);
    }

    addCollapser() {
      const { addCollapser, addScrollerChild, addCollapserChild } = this.props;
      const { collapserId, parentCollapserId, parentScrollerId } = this.props;
      const collapser = { id: collapserId };
      addCollapser(parentScrollerId, parentCollapserId, collapser, collapserId);
      if (parentScrollerId >= 0) {
        addScrollerChild(parentScrollerId, collapser);
      }
      if (parentCollapserId >= 0) {
        addCollapserChild(parentCollapserId, collapser);
      }
    }

    render() {
      const { collapserId, parentScrollerId } = this.props;
      if (collapserId >= 0 && parentScrollerId >= 0) {
        return (
          <CollapserController
            {...cleanHoCProps(
              this.props,
              WrappedCollapserController.defaultProps,
              collapserControllerActions
            )}
          />
        );
      }
      return <div />;
    }
  }

  WrappedCollapserController.defaultProps = {
    cleanUpCache: collapserId => removeSelector(collapserId),
    collapserId: null,
    parentCollapserId: null,
    parentScrollerId: null,
  };

  WrappedCollapserController.propTypes = {
    addCollapser: PropTypes.func.isRequired,
    addCollapserChild: PropTypes.func.isRequired,
    cleanUpCache: PropTypes.func,
    removeCollapser: PropTypes.func.isRequired,
    removeCollapserChild: PropTypes.func.isRequired,
    addScrollerChild: PropTypes.func.isRequired,
    removeScrollerChild: PropTypes.func.isRequired,

    collapserId: ofNumberTypeOrNothing,
    parentCollapserId: ofNumberTypeOrNothing,
    parentScrollerId: ofNumberTypeOrNothing,
  };


  return connect(undefined, collapserControllerActions)(WrappedCollapserController);
};

export default collapserControllerWrapper;
