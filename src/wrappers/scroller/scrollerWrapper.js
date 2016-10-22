import React, {PropTypes, Component} from 'react';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {addScroller} from '../../actions';

import selectors from '../../selectors';
const {nextScrollerIdSelector} = selectors.collapser;
const {ifNotFirstSec} = selectors.utils;

export const ScrollerWrapper = (ScrollerComponent) => {

  class WrappedScroller extends Component {

    static propTypes = {
      actions: PropTypes.object.isRequired,
      nextScrollerId: PropTypes.number.isRequired,
      scrollerId: PropTypes.number,
    }

    static childContextTypes = {
      parentScrollerId: React.PropTypes.number,
    }

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
