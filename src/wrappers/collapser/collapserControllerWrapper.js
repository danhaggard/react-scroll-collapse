import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ofNumberTypeOrNothing } from '../../utils/propTypeHelpers';
import { collapserControllerActions } from '../../actions';
import cleanHoCProps from '../../utils/cleanHoCProps';

export const collapserControllerWrapper = (CollapserController) => {

  class WrappedCollapserController extends Component {

    constructor(props) {
      super(props);

      const { collapserId, parentCollapserId, parentScrollerId } = this.props;

      this.collapserId = collapserId;
      this.parentCollapserId = parentCollapserId;
      this.parentScrollerId = parentScrollerId;

      /*
        create state slice for this collapser in redux store.
      */
      this.addCollapser();
    }

    componentWillUnmount() {
      const { removeCollapserChild, removeScrollerChild, removeCollapser } = this.props;
      if (this.parentCollapserId >= 0) {
        removeCollapserChild(this.parentCollapserId, this.collapserId);
      }
      if (this.parentScrollerId >= 0) {
        removeScrollerChild(this.parentScrollerId, this.collapserId);
      }
      removeCollapser(this.parentCollapserId, this.parentScrollerId, this.collapserId);
    }

    addCollapser() {
      const { addCollapser, addScrollerChild, addCollapserChild } = this.props;
      const collapser = { id: this.collapserId };
      addCollapser(this.parentScrollerId, this.parentCollapserId, collapser, this.collapserId);
      if (this.parentScrollerId >= 0) {
        addScrollerChild(this.parentScrollerId, collapser);
      }
      if (this.parentCollapserId >= 0) {
        addCollapserChild(this.parentCollapserId, collapser);
      }
    }

    render() {
      if (this.collapserId >= 0 && this.parentScrollerId >= 0) {
        return (
          <CollapserController
            {...cleanHoCProps(
              this.props,
              WrappedCollapserController.defaultProps,
              WrappedCollapserController.propTypes // eslint-disable-line
            )}
            collapserId={this.collapserId}
            parentCollapserId={this.parentCollapserId}
            parentScrollerId={this.parentScrollerId}
          />
        );
      }
      return <div />;
    }
  }

  WrappedCollapserController.defaultProps = {
    collapserId: null,
    parentCollapserId: null,
    parentScrollerId: null,
  };

  WrappedCollapserController.propTypes = {
    addCollapser: PropTypes.func.isRequired,
    addCollapserChild: PropTypes.func.isRequired,
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
