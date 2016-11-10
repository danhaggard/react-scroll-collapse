import React, {PropTypes, Component} from 'react';
import {Motion, spring} from 'react-motion';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {watchInitialise} from '../../actions';

import selectors from '../../selectors';
const {offsetTopSelector, scrollTopSelector, toggleScrollSelector} = selectors.scroller;

import Scroller from '../../components/Scroller';


const scrollerMotionWrapper = (ScrollerComponent) => {

  /*
    Scroller motion controls the scroll animation by rendering
    src/components/Scroller and passing a scrollTop prop that has been
    interpolated into a series of values by react-motion.

    It is also responsibile for intermediating between the sagas and the Scroller
    component by initialising a saga for that Scroller and passing the
    getScrollTop method from Scroller to that saga.
  */
  class ScrollerMotion extends Component {

    constructor(props) {
      super(props);
      this.state = {
        springConfig: {stiffness: 170, damping: 20},
        motionStyle: {y: 0},
        prevRenderType: null,
      };
    }

    /*
      Initiate a saga to watch this Scroller for ExpandCollapse/All actions.
    */
    componentDidMount() {
      this.props.actions.watchInitialise(this.props.scrollerId, this.child.getScrollTop);
    }

    componentWillReceiveProps(nextProps) {
      /*
        springConfig overide default -  when supplied by parent.
      */
      if (this.props.springConfig !== nextProps.springConfig) {
        this.setState({springConfig: nextProps.springConfig});
      }

      /*
        Ensures that the scrollTop start val for <Motion> is in sync with the UI
        see:
        https://github.com/danhaggard/react-scroll-collapse/issues/2#issue-186472122
      */
      if (this.props.toggleScroll !== nextProps.toggleScroll) {
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
          motionStyle: {y: spring(this.getScrollTo(),
            this.state.springConfig)},
          prevRenderType: 'autoScroll',
        });
      }
    }

    /*
      If scrollTo prop passed a value - use that.  Otherwise use the current
      offsetTop value added to any supplied offset.
    */
    getScrollTo() {
      const {offsetTop, scrollTo} = this.props;
      let {offsetScrollTo} = this.props;
      if (typeof scrollTo === 'number') {
        return scrollTo;
      }
      offsetScrollTo = offsetScrollTo === undefined || null ? 0 : offsetScrollTo;
      return offsetTop + offsetScrollTo;
    }


    render() {
      const {children, scrollerId, style, className, onRest} = this.props;

      /*
        The use of the ref in ScrollerComponent allows ScrollerMotion
        to access the methods we defined on Scroller using ref.  In this case
        getScrollTop which is now accessible via: this.child.getScrollTop
      */
      const scroller = (
        <ScrollerComponent
          children={children}
          className={className}
          ref={child => {
            this.child = child;
          }}
          scrollerId={scrollerId}
          style={style}
        />
      );

      /*
        I was previously passing val.y into ScrollerComponent - which resulted
        in a render of ScrollerComponent for every val.y passed by <Motion>.
        Now on every render in <Motion> - it calls the setScrollTop callback
        which creates the scroll animation - but doesn't re-render ScrollerComponent
        at all.

        Kudos to nktb: https://github.com/chenglou/react-motion/issues/357#issuecomment-237741940
      */
      const motionChild = this.child ? (val) => {
        this.child.setScrollTop(val.y);
        return scroller;
      } : () => scroller;

      return (
        <Motion
          onRest={onRest}
          style={this.state.motionStyle} >
          {motionChild}
        </Motion>
      );
    }
  }

  ScrollerMotion.propTypes = {
    actions: PropTypes.object.isRequired,
    children: PropTypes.node,
    className: PropTypes.string,
    offsetScrollTo: PropTypes.number,
    offsetTop: PropTypes.number.isRequired,
    onRest: PropTypes.func,
    scrollerId: PropTypes.number.isRequired,
    scrollTo: PropTypes.number,
    scrollTop: PropTypes.number.isRequired,
    springConfig: PropTypes.object,
    style: PropTypes.object,
    toggleScroll: PropTypes.bool.isRequired,
  };

  return ScrollerMotion;
};

/*
  the final offsetTop and scrollTop values (representing state at end of scrolling)
  are passed back to the Scroller by the sagas through redux state after all
  the collapser animation has finised.
*/
const mapStateToProps = (state, ownProps) => ({
  offsetTop: offsetTopSelector(state)(ownProps.scrollerId),
  scrollTop: scrollTopSelector(state)(ownProps.scrollerId),
  toggleScroll: toggleScrollSelector(state)(ownProps.scrollerId)
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    watchInitialise,
  }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(scrollerMotionWrapper(Scroller));
