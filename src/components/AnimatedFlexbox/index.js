import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Motion, presets, spring } from 'react-motion';
import forwardRefWrapper from '../../utils/forwardRef';
import { MOTION_SPRINGS, DEFAULT_MOTION_SPRING } from '../../const';
import { ofChildrenType, ofNumberStringTypeOrNothing } from '../../utils/propTypeHelpers';

const FLEX_STYLE = {
  child: {
    flex: '1 1 15%',
  },
  parent: {
    alignContent: 'start',
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
};

class AnimatedFlexbox extends Component {

  // defaultSpringConfig = { stiffness: 170, damping: 20 };

  defaultSpringConfig = MOTION_SPRINGS.slow;

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

  calcPixels = percentage => percentage * this.parentWidth;

  getFlexBasisString = pixelInt => `1 1 ${pixelInt}px`;

  getFlexBasisStringPer = per => `1 1 ${per * 100}%`;

  getInterpolFlexPercent = ({ flex }) => ({
    flex: this.getFlexBasisStringPer(flex)
  });

  getInterpolFlex = ({ flex }) => ({
    flex: this.getFlexBasisString(this.calcPixels(flex))
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
    return { flex: spring(flexBasis, this.getSpringConfig()) };
  }

  render() {
    const {
      children,
      className,
      flexRef,
      style
    } = this.props;
    return (
      <Motion
        style={this.getMotionStyle()}
      >
        {
          interpolatedStyle => (
            <div
              className={className}
              ref={flexRef}
              style={{
                ...FLEX_STYLE.parent,
                ...style,
                ...this.getInterpolFlexPercent(interpolatedStyle)
              }}
            >
              { children }
            </div>
          )
        }
      </Motion>
    );
  }
}

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
