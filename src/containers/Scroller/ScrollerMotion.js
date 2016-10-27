import React, {PropTypes, Component} from 'react';
import {Motion, spring, presets} from 'react-motion';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {watchInitialise} from '../../actions';

import selectors from '../../selectors';
const {offsetTopSelector, scrollTopSelector} = selectors.scroller;

import Scroller from '../../components/Scroller';


class ScrollerMotion extends Component {
  /*
    The strategy here is to use this to wrap the Scroller element so that
    the latter can serve as the recipient of the props.scrollTop value that
    is interpolated by react.motion.  So react-motion will create an array of
    values that will be sent to the Scroller component as its scrollTop prop.
    causing a bunch of renders - creating the animation.
  */

  constructor(props) {
    super(props);
    this.state = {
      onWheel: false,
      springConfig: {stiffness: 170, damping: 20},
      motionStyle: {y: 0},
      prevRenderType: null,
    };
  }

  /*
    a saga is activated that tells redux to wait for the user input that will
    precipitate a scroll response.  this.child.getScrollTop is a call back
    the queries the dom for the scrollTop value at the right time.
  */
  componentDidMount() {
    this.props.actions.watchInitialise(this.props.scrollerId, this.child.getScrollTop);
  }

  /*
    The react-motion component <Motion> uses as its starting point, the scrollTop
    value passed to it in the previous render - and we don't have the option of
    interfering with this manually.

    But say the scrollTop value is set to the end point of the last auto scroll
    event - and the user then scrolls manually.  Then the scrollTop value is now
    out of sync with the scrollTop starting point in the browser and it so it will
    jump back to the value stored in <Motion> before continuing with the animation.

    The issue being that we don't know if a change in the scrollTop value
    is a result of react-motion or the user (or some other component even). We
    don't want to interfere when react-motion is animating.

    The fix used here is to set local state to tell <Motion> not to use an
    animation on the next render (motionStyle doesn't use a spring)
    This syncs the <Motion> starting point with the UI.  setState automatically
    triggers this re-render.

    The remaining problem is that we still need to trigger the actual animation
    but there will be no further changes in props to trigger any more renders.
    We use the state key prevRenderType to tell the component to start the
    animation in componentDid update.

    Pretty ugly - better to use an onScroll event listener and a timeout to
    check for scroll ending?  Not straightforward either and may well cause
    more re-renders than this solution.
  */
  componentWillReceiveProps(nextProps) {
    /* Update the springConfig without a re-render */
    if (this.props.springConfig !== nextProps.springConfig) {
      this.setState({springConfig: nextProps.springConfig});
    }

    if (
      this.state.onWheel ||
      /*
        this.props.offsetTop !== nextProps.offsetTop

        The temp ugly hack fixing the case where both scrollTop are 0
        introduces new problem where a change in offsetTop will no longer
        trigger an animation under certain circumstances (if you open and
        close the same nested collapser repeatedly and then click one of
        the nested collapsres without scrolling)
        This forces a re-render.
      */
      this.props.offsetTop !== nextProps.offsetTop || (
        /*
          this.props.scrollTop !== nextProps.scrollTop

          This condition is the one that handles the ui sync issue.
        */
        this.props.scrollTop !== nextProps.scrollTop || (
          /*
            This condition also forces a re-render because of a bug where if
            both these are set to 0, (and they will on first render) then after a
            collapse action is fired the new scrollTop prop value isn't passed into
            this component and the auto scroll fails.

            I haven't tracked down the real source of the problem yet. fix temporary.
          */
          this.props.scrollTop === 0 && nextProps.scrollTop === 0
        )
      )
    ) {
      this.setState({
        motionStyle: {y: nextProps.scrollTop},
        prevRenderType: 'uiSync',
      });
    }
  }

  /*
   Now that react motion is assured to be in sync with the dom scrollTop state,
   we need to precipitate another render to start the animation.  So we call
   setState here to do so - but only conditional on the previous render being
   a scrollTop ui sync so we don't get infinite loop.
  */
  componentDidUpdate() {
    if (this.state.prevRenderType === 'uiSync') {
      this.setState({
        motionStyle: {y: spring(this.props.offsetTop, this.state.springConfig)},
        prevRenderType: 'autoScroll',
      });
    }
  }

  render() {
    const {children, scrollerId} = this.props;
    /*
      the props.offsetTop value is passed into the motionStyle state object.
      Which is in turn passes into the style prop of the Motion element.  This
      interpolates that y value - and does a bunch of timed renders to yield
      a smooth animation.
    */

    /*
      The use of the ref in the childComponent allows the component to access
      the child and any methods we added when setting the ref on the child itself.
      The child here is the Scroller component.  And we added a getScrollTop
      method which is passed on to the sagas who call it when they need to.  The
      scrollTop value then gets passed back through redux state.
    */
    return (
      <Motion onRest={this.onRest} style={this.state.motionStyle} >
        {value => {
          const childComponent = React.cloneElement(children, {
            ref: child => {
              this.child = child;
            },
            onWheel: this.handleOnWheel,
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

ScrollerMotion.propTypes = {
  actions: PropTypes.object.isRequired,
  children: PropTypes.node,
  scrollTop: PropTypes.number.isRequired,
  offsetTop: PropTypes.number.isRequired,
  scrollerId: PropTypes.number.isRequired,
  springConfig: PropTypes.object,
};

// using a higher order component to fuse the two components together.
const autoScroller = (ScrollerMotionComponent, ScrollerComponent) => {

  const AutoScroller = (props) => {
    /* don't need to pass actions into Scroller */
    const {actions, ...otherProps} = props;
    return (
      <ScrollerMotionComponent actions={actions} {...otherProps}>
        <ScrollerComponent {...otherProps} />
      </ScrollerMotionComponent>
    );
  };
  AutoScroller.propTypes = {
    actions: PropTypes.object.isRequired,
  };
  return AutoScroller;
};

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
