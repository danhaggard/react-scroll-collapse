import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Motion, spring } from 'react-motion';
import Scroller from '../../components/Scroller';

import { ofFuncTypeOrNothing, ofNumberTypeOrNothing, ofObjectTypeOrNothing } from '../../utils/propTypeHelpers';
import { DEFAULT_MOTION_SPRING } from '../../const';
import { setContextAttrs } from '../../utils/objectUtils';


const scrollerMotionWrapper = (ScrollerComponent) => {

  class ScrollerMotion extends PureComponent {

    setAttrs = (() => setContextAttrs(this))();

    defaultSpringConfig = DEFAULT_MOTION_SPRING;

    prevY = null;

    getSpringConfig = () => this.props.springConfig || this.defaultSpringConfig;

    getUserScrollActive = this.methods.scroller.getUserScrollActive;

    setUserScrollActive = this.methods.scroller.setUserScrollActive;

    setScrollTop = this.methods.scroller.setScrollTop;

    breakScrollAnimation = () => {
      const { onAnimationCancel } = this.props;
      this.setUserScrollActive(true);
      if (typeof onAnimationCancel === 'function') {
        onAnimationCancel();
      }
    }

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
      console.log('ScrollerMotion y, this.prevY', y, this.prevY);

      if (needsReset) {
        console.log('ScrollerMotion needsReset');
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
        console.log('ScrollerMotion, scrollTo', scrollTo);
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
              if (!this.getUserScrollActive()) {
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
    scrollOffset: PropTypes.number,
    scrollTo: ofNumberTypeOrNothing,
    springConfig: PropTypes.object,
    style: PropTypes.object,

    /* provided by scrollerProvider via context */
    providerMotionStyle: PropTypes.object.isRequired,
  };

  ScrollerMotion.whyDidYouRender = {
    logOnDifferentValues: false,
    customName: 'ScrollerMotion'
  };

  return ScrollerMotion;
};

export default scrollerMotionWrapper(Scroller);
