import React, {PropTypes, Component} from 'react';
import {Motion, spring, presets} from 'react-motion';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {watchInitialise} from '../../actions';

import selectors from '../../selectors';
const {offsetTopSelector, scrollTopSelector} = selectors.scroller;

import Scroller from '../../components/Scroller';


class ScrollerMotion extends Component {
  // The strategy here is to use this to wrap the Scroller element so that
  // the latter can serve as the recipient of the props.scrollTop value that
  // is interpolated by react.motion.  So react-motion will create an array of
  // values that will be sent to the Scroller component as its scrollTop prop.
  // causing a bunch of renders - creating the animation.

  static propTypes = {
    actions: PropTypes.object,
    children: PropTypes.node,
    scrollTop: PropTypes.number,
    offsetTop: PropTypes.number,
    scrollerId: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = {
      motionStyle: {y: 0},
      lastScrollToType: null,
    };
  }

  // a saga is activated that tells redux to wait for the user input that will
  //  precipitate a scroll response.  this.child.getScrollTop is a call back
  // the queries the dom for the scrollTop value at the right time.
  componentDidMount() {
    this.props.actions.watchInitialise(this.props.scrollerId, this.child.getScrollTop);
  }

  // React motion uses as its starting point, the values we passed to it in the
  // previous render.  So without intervention our scroller will beging scrolling
  // from that point.  But scrolling may have happened via user input.  So we make
  // sure react motion does a straight render (without animation) so that it
  // can store that value as its starting point.
  componentWillReceiveProps(nextProps) {
    if (this.props.scrollTop !== nextProps.scrollTop) {
      this.setState({
        motionStyle: {y: nextProps.scrollTop},
        lastScrollToType: 'scrollTop',
      });
    }
  }

  // now that react motion is in sync with the dom scrollTop state, we need
  // to precipitate another render to start the animation.
  componentDidUpdate() {
    if (this.state.lastScrollToType === 'scrollTop') {
      this.setState({
        motionStyle: {y: spring(this.props.offsetTop, presets.wobbly)},
        lastScrollToType: 'offsetTop',
      });
    }
  }

  render() {
    const {children, scrollerId} = this.props;
    // theprops.offsetTop value is passed into the motionStyle state object.
    // Which is in turn passes into the style prop of the Motion element.  This
    // interpolates that y value - and does a bunch of timed renders to yield
    // a smooth animation.
    return (
      <Motion onRest={this.onRest} style={this.state.motionStyle} >
        {value => {
          const childComponent = React.cloneElement(children, {
            ref: child => {
              this.child = child;
            },
            scrollTop: value.y,
            scrollerId,
          });
          return childComponent;
        }
      }
      </Motion>
    );
  }
}

// using a higher order component to fuse the two components together.
// to-do check what props are actually needed to be sent to each.
const autoScroller = (ScrollerMotionComponent, ScrollerComponent) => (props) => (
  <ScrollerMotionComponent {...props}>
    <ScrollerComponent {...props} />
  </ScrollerMotionComponent>
);

// the final offsetTop and scrollTop values are passed back to the Scroller
// by the sagas through redux state after all the collapser animation has finised.
const mapStateToProps = (state, ownProps) => ({
  offsetTop: offsetTopSelector(state)(ownProps.scrollerId),
  scrollTop: scrollTopSelector(state)(ownProps.scrollerId),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    watchInitialise,
  }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(autoScroller(ScrollerMotion, Scroller));
