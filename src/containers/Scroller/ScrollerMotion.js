import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Motion, spring } from 'react-motion';
import Scroller from '../../components/Scroller';

import { ofFuncTypeOrNothing, ofNumberTypeOrNothing, ofObjectTypeOrNothing } from '../../utils/propTypeHelpers';


const scrollerMotionWrapper = (ScrollerComponent) => {

  /*
    Scroller motion controls the scroll animation by rendering
    src/components/Scroller and passing a scrollTop prop that has been
    interpolated into a series of values by react-motion.

    It is also responsibile for intermediating between the sagas and the Scroller
    component by initialising a saga for that Scroller and passing the
    getScrollTop method from Scroller to that saga.
  */
  class ScrollerMotion extends PureComponent {

    defaultSpringConfig = { stiffness: 170, damping: 20 };

    prevY = null;

    /*
      userScrollActive: used to give back scroll control to the user.
      Set to true so event handlers do not fire until animation starts.
      Kept outside react state to prevent unecessary renders.
    */
    userScrollActive = true;

    componentDidUpdate() {
      this.userScrollActive = false;
    }

    setScrollTop = this.props.contextMethods.scroller.setScrollTop;

    /*
      If scrollTo prop passed a value - use that.  Otherwise use the current
      offsetTop value added to any supplied offset.
    */
    modifyMotionStyle = () => {
      const {
        autoScrollDisabled,
        motionStyle,
        scrollOffset,
        scrollTo
      } = this.props;

      let { providerMotionStyle: { needsReset, y } } = this.props; // eslint-disable-line prefer-const, max-len

      if (needsReset) {
        this.prevY = y;
        return { y };
      }

      if (autoScrollDisabled) {
        return { y: this.prevY };
      }

      if (motionStyle) {
        this.prevY = motionStyle.y;
        return motionStyle;
      }

      if (typeof scrollTo === 'number') {
        y = scrollTo;
      } else {
        y += scrollOffset;
      }

      this.prevY = y;

      if (!needsReset) {
        y = spring(y, this.getSpringConfig());
      }

      return { y };
    }

    breakScrollAnimation = () => {
      const { onAnimationCancel } = this.props;
      this.userScrollActive = true;
      if (typeof onAnimationCancel === 'function') {
        onAnimationCancel();
      }
    }

    getUserScrollActive = () => this.userScrollActive;

    getSpringConfig = () => this.props.springConfig || this.defaultSpringConfig;

    render() {
      const { onRest, ...rest } = this.props;
      const motionStyle = this.modifyMotionStyle();
      const scrollerProps = {
        ...rest,
        breakScrollAnimation: this.breakScrollAnimation,
        getUserScrollActive: this.getUserScrollActive
      };
      return (
        <Motion
          onRest={onRest}
          style={motionStyle}>
          {
            /*
              I was previously passing val.y into ScrollerComponent - which resulted
              in a render of ScrollerComponent for every val.y passed by <Motion>.
              Now on every render in <Motion> - it calls the setScrollTop callback
              which creates the scroll animation - but doesn't re-render ScrollerComponent
              at all.

              Kudos to nktb: https://github.com/chenglou/react-motion/issues/357#issuecomment-237741940

              Also, by keeping userScrollActive state outside of React - we avoid
              an unneccesary render of the parent and child components.
            */
            (val) => {
              if (!this.userScrollActive) {
                this.setScrollTop(val.y);
              }
              return (
                <ScrollerComponent
                  {...scrollerProps}
                />
              );
            }
          }
        </Motion>
      );
    }
  }

  ScrollerMotion.defaultProps = {
    autoScrollDisabled: false,
    children: [],
    className: '',
    onAnimationCancel: null,
    onRest: null,
    motionStyle: null,
    scrollerId: null,
    scrollOffset: 0,
    scrollTo: null,
    springConfig: null,
    style: {},
  };

  ScrollerMotion.propTypes = {
    autoScrollDisabled: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    motionStyle: ofObjectTypeOrNothing,
    onAnimationCancel: ofFuncTypeOrNothing,
    onRest: ofFuncTypeOrNothing,
    scrollerId: ofNumberTypeOrNothing,
    scrollOffset: PropTypes.number,
    scrollTo: ofNumberTypeOrNothing,
    springConfig: PropTypes.object,
    style: PropTypes.object,

    /* provided by scrollerProvider via context */
    contextMethods: PropTypes.object.isRequired,
    providerMotionStyle: PropTypes.object.isRequired,
  };

  ScrollerMotion.whyDidYouRender = {
    logOnDifferentValues: false,
    customName: 'ScrollerMotion'
  };

  return ScrollerMotion;
};

export default scrollerMotionWrapper(Scroller);
