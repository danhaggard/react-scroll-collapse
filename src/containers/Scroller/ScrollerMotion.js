import React, {PropTypes, Component} from 'react';
import {Motion, spring} from 'react-motion';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {watchInitialise} from '../../actions';

import selectors from '../../selectors';
const {offsetTopSelector, scrollTopSelector} = selectors.scroller;

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
      console.log('this.props.scrollTop, nextProps.scrollTop, this.child.elem.scrollTop',
        this.props.scrollTop, nextProps.scrollTop, this.child.elem.scrollTop);
      console.log('this.props.offsetTop, nextProps.offsetTop',
        this.props.offsetTop, nextProps.offsetTop);
      console.log('call getScrollTop', this.child ? this.child.getScrollTop() : 'noChild');
      /*
        This long disjunction handles various rendering edge cases.  Detail here:
        https://github.com/danhaggard/react-scroll-collapse/issues/2#issue-186472122
      */
      /*
      if (
        this.props.offsetTop !== nextProps.offsetTop || (

          this.props.scrollTop !== nextProps.scrollTop || (

            this.props.scrollTop === 0 && nextProps.scrollTop === 0
          )
        )
      ) {
        this.setState({
          motionStyle: {y: nextProps.scrollTop},
          prevRenderType: 'uiSync',
        });
      }
      */
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

    getDefaultStyle(child) {
      return child && child.elem ? {y: this.child.elem.scrollTop} : null;
    }

    getMotionStyle() {
      return {y: spring(this.props.offsetTop, this.state.springConfig)};
    }

    render() {
      const {children, scrollerId, style, className, onRest} = this.props;
      const defaultStyle = this.getDefaultStyle(this.child);
//      console.log('defaultStyle', defaultStyle);
//      console.log('this.props.offsetTop, this.state.springConfig',
//        this.props.offsetTop, this.state.springConfig);
      /*
        The use of the ref in the cloned childComponent (Scroller) allows ScrollerMotion
        to access the methods we defined on Scroller using ref.  In this case
        getScrollTop which is now accessible via: this.child.getScrollTop
        (Could use this to set elem.scrollTop as well from here.)

        value.y is the interpolated scrollTop value we pass back into Scroller.
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
      return (
        <Motion onRest={onRest} defaultStyle={defaultStyle} style={this.state.motionStyle} >
          {this.child ? (val) => {
            console.log('val', val);
            this.child.setScrollTop(val.y);
            return scroller;
          } : (val) => scroller}
        </Motion>
      );
    }
  }

  ScrollerMotion.propTypes = {
    actions: PropTypes.object.isRequired,
    children: PropTypes.node,
    className: PropTypes.string,
    offsetTop: PropTypes.number.isRequired,
    onRest: PropTypes.func,
    scrollerId: PropTypes.number.isRequired,
    scrollTop: PropTypes.number.isRequired,
    springConfig: PropTypes.object,
    style: PropTypes.object,
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
