import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Motion, spring } from 'react-motion';
import Scroller from '../../components/Scroller';

import { ofFuncTypeOrNothing, ofNumberTypeOrNothing } from '../../utils/propTypeHelpers';
import actions from '../../actions';

import { scroller as selectors } from '../../selectors';

const { selectors: { offsetTopSelector, scrollTopSelector, toggleScrollSelector } } = selectors;

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
        springConfig: { stiffness: 170, damping: 20 },
        motionStyle: { y: 0 },
        prevRenderType: null,
      };
    }

    /*
      Initiate a saga to watch this Scroller for ExpandCollapse/All actions.
    */
    componentDidMount() {
      const { scrollerId, watchInitialise } = this.props;
      watchInitialise(scrollerId, this.child.getScrollTop);
    }

    componentWillReceiveProps(nextProps) {
      const { springConfig, toggleScroll } = this.props;
      /*
        springConfig overide default -  when supplied by parent.
      */
      if (springConfig !== nextProps.springConfig) {
        this.setState({ springConfig: nextProps.springConfig });
      }

      /*
        Ensures that the scrollTop start val for <Motion> is in sync with the UI
        see:
        https://github.com/danhaggard/react-scroll-collapse/issues/2#issue-186472122
      */
      if (toggleScroll !== nextProps.toggleScroll) {
        this.setState({
          motionStyle: { y: nextProps.scrollTop },
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
      const { prevRenderType, springConfig } = this.state;
      if (prevRenderType === 'uiSync') {
        this.setState({ // eslint-disable-line react/no-did-update-set-state
          motionStyle: {
            y: spring(this.getScrollTo(), springConfig)
          },
          prevRenderType: 'autoScroll',
        });
      }
    }

    /*
      If scrollTo prop passed a value - use that.  Otherwise use the current
      offsetTop value added to any supplied offset.
    */
    getScrollTo() {
      const { offsetTop, scrollTo } = this.props;
      let { offsetScrollTo } = this.props;
      if (typeof scrollTo === 'number') {
        return scrollTo;
      }
      offsetScrollTo = offsetScrollTo === undefined || null ? 0 : offsetScrollTo;
      return offsetTop + offsetScrollTo;
    }


    render() {
      const {
        children,
        scrollerId,
        style,
        className,
        onRest
      } = this.props;

      const { motionStyle } = this.state;
      /*
        The use of the ref in ScrollerComponent allows ScrollerMotion
        to access the methods we defined on Scroller using ref.  In this case
        getScrollTop which is now accessible via: this.child.getScrollTop
      */
      const scroller = (
        <ScrollerComponent
          className={className}
          ref={(child) => {
            this.child = child;
          }}
          scrollerId={scrollerId}
          style={style}
        >
          { children }
        </ScrollerComponent>
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
          style={motionStyle}>
          {motionChild}
        </Motion>
      );
    }
  }

  ScrollerMotion.defaultProps = {
    children: [],
    className: '',
    offsetScrollTo: null,
    offsetTop: null,
    onRest: null,
    scrollerId: null,
    scrollTo: null,
    scrollTop: null,
    springConfig: {},
    style: {},
    // redux sets default as well - but this renders before that state is set.  TODO: investigate
    toggleScroll: false,
  };

  ScrollerMotion.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    offsetScrollTo: ofNumberTypeOrNothing,
    offsetTop: ofNumberTypeOrNothing,
    onRest: ofFuncTypeOrNothing,
    scrollerId: ofNumberTypeOrNothing,
    scrollTo: ofNumberTypeOrNothing,
    scrollTop: ofNumberTypeOrNothing,
    springConfig: PropTypes.object,
    style: PropTypes.object,
    toggleScroll: PropTypes.bool,
    watchInitialise: PropTypes.func.isRequired,
  };

  return ScrollerMotion;
};

/*
  the final offsetTop and scrollTop values (representing state at end of scrolling)
  are passed back to the Scroller by the sagas through redux state after all
  the collapser animation has finised.
*/
const mapStateToProps = () => (state, ownProps) => ({
  offsetTop: (offsetTopSelector())(state)(ownProps.scrollerId),
  scrollTop: (scrollTopSelector())(state)(ownProps.scrollerId),
  toggleScroll: (toggleScrollSelector())(state)(ownProps.scrollerId)
});

const mapDispatchToProps = {
  watchInitialise: actions.watchInitialise
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(scrollerMotionWrapper(Scroller));
