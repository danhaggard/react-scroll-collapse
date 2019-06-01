import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Motion, spring } from 'react-motion';
import forwardRefWrapper from '../../utils/forwardRef';
import { MOTION_SPRINGS, DEFAULT_MOTION_SPRING } from '../../const';
import { ofChildrenType } from '../../utils/propTypeHelpers';

const FLEX_STYLE = {
  child: {
    flex: '1 1 content',
  },
  parent: {
    alignContent: 'start',
    alignItems: 'flex-start',
    display: 'flex',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
};


const FlexMotion = React.forwardRef(({
  id,
  className,
  children,
  flexStyle,
  getInterpolatedStyle,
  motionStyle,
  style,
}, ref) => (
  <Motion
    style={motionStyle}
  >
    {
      (interpolatedStyle) => {
        const newStyle = {
          ...flexStyle,
          ...style,
          ...getInterpolatedStyle(interpolatedStyle)
        };
        console.log('id, interpolated, parsed', id, interpolatedStyle.width, newStyle.width);
        return (
          <div
            className={className}
            ref={ref}
            style={newStyle}
          >
            { children }
          </div>
        );
      }
    }
  </Motion>
));

class AnimatedFlexbox extends Component { // eslint-disable-line

  // defaultSpringConfig = { stiffness: 170, damping: 20 };

  defaultSpringConfig = DEFAULT_MOTION_SPRING;

  componentDidMount() {
    const { flexRef } = this.props;
    this.ref = flexRef;
    if (this.ref && this.ref.current) {
      this.elem = this.ref.current;
    }
    if (this.elem && this.elem.parentNode) {
      this.parentNode = this.elem.parentNode;
    }
    this.parentWidth = this.getParentWidth();
  }

  calcPixels = (percentage) => {
    return percentage * this.parentWidth;
  }

  getFlexBasisString = pixelInt => `1 1 ${pixelInt}px`;

  getFlexBasisStringPer = per => `1 1 ${per * 100}%`;

  getWidthString = pixelInt => `${pixelInt}px`;

  getWidthStringPer = per => `${per * 100}%`;

  getInterpolFlexPercent = ({ flex }) => ({
    flex: this.getFlexBasisStringPer(flex)
  });

  getInterpolFlex = ({ flex }) => ({
    flex: this.getFlexBasisString(this.calcPixels(flex))
  });

  getInterpolWidthPixels = ({ width }) => ({
    width: this.getWidthString(this.calcPixels(width))
  });

  getInterpolWidthPercent = ({ width }) => ({
    width: this.getWidthStringPer(width)
  });

  getParentWidth = (refresh = false) => {
    if (!this.parentWidth || refresh) {
      this.parentWidth = this.parentNode ? this.parentNode.clientWidth : 500;
    }
    return this.parentWidth;
  }

  getSpringConfig = () => this.defaultSpringConfig;

  getMotionStyle = () => {
    const { flexBasis } = this.props;
    const motionStyle = { width: spring(flexBasis, this.getSpringConfig()) };
    console.log('motionStyle', motionStyle);
    return motionStyle;
    // return { width: spring(flexBasis, this.getSpringConfig()) };
    // return { flex: spring(flexBasis, this.getSpringConfig()) };
  }

  render() {
    const {
      id,
      children,
      className,
      flexRef,
      isRootNode,
      style
    } = this.props;
    return !isRootNode ? (
      <FlexMotion
        id={id}
        className={className}
        flexStyle={FLEX_STYLE.parent}
        getInterpolatedStyle={this.getInterpolWidthPercent}
        motionStyle={this.getMotionStyle()}
        ref={flexRef}
        style={style}
      >
        { children }
      </FlexMotion>
    ) : (
      <div
        className={className}
        ref={flexRef}
        style={{
          ...FLEX_STYLE.parent,
          ...style,
        }}
      >
        { children }
      </div>
    );

  }
}

/*
<Motion
  style={this.getMotionStyle()}
>
  {
    (interpolatedStyle) => {

      const newStyle = {
        ...FLEX_STYLE.parent,
        ...style,
        ...this.getInterpolWidthPercent(interpolatedStyle)
      };
      console.log('newStyle', newStyle.width);
      return (
        <div
          className={className}
          ref={flexRef}
          style={{
            ...FLEX_STYLE.parent,
            ...style,
            ...this.getInterpolWidthPercent(interpolatedStyle)
          }}
        >
          { children }
        </div>
      )
    }
  }
</Motion>
*/

AnimatedFlexbox.defaultProps = {
  children: [],
  className: '',
  flexBasis: 0.15,
  style: {},
};

AnimatedFlexbox.propTypes = {
  children: ofChildrenType,
  className: PropTypes.string,
  flexBasis: PropTypes.number,
  flexRef: PropTypes.object.isRequired,
  style: PropTypes.object,
};

AnimatedFlexbox.whyDidYouRender = {
  logOnDifferentValues: false,
  customName: 'AnimatedFlexbox'
};

const AnimatedFlexboxRef = forwardRefWrapper(AnimatedFlexbox, 'flexRef');

export default AnimatedFlexboxRef;
