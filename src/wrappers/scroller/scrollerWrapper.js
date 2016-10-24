import React, {PropTypes, Component} from 'react';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {addScroller} from '../../actions';

import selectors from '../../selectors';
const {nextScrollerIdSelector} = selectors.scroller;
const {ifNotFirstSec} = selectors.utils;

export const scrollerWrapper = (ScrollerComponent) => {

  class WrappedScroller extends Component {

    getChildContext() {
      return {
        parentScrollerId: this.scrollerId,
      };
    }

    componentWillMount() {
      const {scrollerId, nextScrollerId} = this.props;
      this.scrollerId = ifNotFirstSec(scrollerId, nextScrollerId);
      this.addScroller();
    }

    addScroller() {
      const scroller = {id: this.scrollerId};
      this.props.actions.addScroller(scroller);
    }

    render() {
      const {actions, nextScrollerId, scrollerId, ...other} = this.props;
      if (this.scrollerId >= 0) {
        return (
          <ScrollerComponent
            {...other}
            scrollerId={this.scrollerId}
          />
        );
      }
      return <div />;
    }
  }

  WrappedScroller.propTypes = {
    actions: PropTypes.object.isRequired,
    nextScrollerId: PropTypes.number.isRequired,
    scrollerId: PropTypes.number,
  };

  WrappedScroller.childContextTypes = {
    parentScrollerId: React.PropTypes.number,
  };

  const mapState = (state) => ({
    nextScrollerId: nextScrollerIdSelector(state),
  });

  const mapDispatch = (dispatch) => ({
    actions: bindActionCreators({
      addScroller,
    }, dispatch),
  });

  return connect(mapState, mapDispatch)(WrappedScroller);
};
