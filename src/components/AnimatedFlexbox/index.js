import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Motion, spring } from 'react-motion';
import forwardRefWrapper from '../../utils/forwardRef';
import { MOTION_SPRINGS, DEFAULT_MOTION_SPRING } from '../../const';
import { ofChildrenType, ofFuncTypeOrNothing } from '../../utils/propTypeHelpers';

const FLEX_STYLE = {
  child: {

  },
  parent: {

  },
};

const StaticChild = React.forwardRef(({ children, className, onClick, style, onKeyDown }, ref) => (
  <div
    className={className}
    onClick={onClick}
    ref={ref}
    style={style}
    role="button"
    tabIndex={0}
    onKeyDown={onKeyDown}
    type="button"
  >
    { children }
  </div>
));

StaticChild.whyDidYouRender = {
  logOnDifferentValues: false,
  customName: 'StaticChild'
};

const PureStaticChild = React.memo(StaticChild);

const FlexMotion = React.forwardRef(({ // eslint-disable-line
  className,
  children,
  flexStyle,
  getInterpolatedStyle,
  motionStyle,
  onClick,
  onKeyDown,
  style,
}, ref) => (
  <Motion
    style={motionStyle}
    onClick={onClick}
  >
    {
      (interpolatedStyle) => {
        const newStyle = {
          ...flexStyle,
          ...style,
          ...getInterpolatedStyle(interpolatedStyle)
        };
      //  console.log('id, interpolated, parsed', id, interpolatedStyle.width, newStyle.width);
        return (
          <PureStaticChild
            className={className}
            ref={ref}
            style={newStyle}
            onClick={onClick}
            onKeyDown={onKeyDown}
          >
            { children }
          </PureStaticChild>
        );
      }
    }
  </Motion>
));

FlexMotion.whyDidYouRender = {
  logOnDifferentValues: false,
  customName: 'FlexMotion'
};

const PureFlexMotion = React.memo(FlexMotion);

class AnimatedFlexbox extends PureComponent { // eslint-disable-line

  defaultSpringConfig = DEFAULT_MOTION_SPRING;

  childStyle = {
    ...FLEX_STYLE.parent,
    ...this.props.style,
  }

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

  calcPixels = percentage => (percentage * this.parentWidth);

  getBackgroundString = val => `linear-gradient(${val}deg, #ddffab, #abe4ff, #d9abff)`

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

  getInterpolWidthRotation = ({ background, width }) => ({
    background: this.getBackgroundString(background),
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
    const { backgroundRotation, flexBasis } = this.props;
    const motionStyle = {
      background: spring(backgroundRotation, this.getSpringConfig()),
      width: spring(flexBasis, this.getSpringConfig())
    };
    return motionStyle;
  }

  handleOnClick = (e) => {
    if (e.target.type !== 'button') {
      e.stopPropagation();
      this.props.onClick(e);
    }
  }
  /*
    Remember stopping propagation can break things above.
  */
  handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.stopPropagation();
      this.props.onKeyDown(e);
    }
  }

  render() {
    const {
      children,
      className,
      flexRef,
      isRootNode,
      style
    } = this.props;
    return !isRootNode ? (
      <PureFlexMotion
        className={className}
        flexStyle={FLEX_STYLE.parent}
        getInterpolatedStyle={this.getInterpolWidthRotation}
        motionStyle={this.getMotionStyle()}
        onClick={this.handleOnClick}
        onKeyDown={this.handleKeyDown}
        ref={flexRef}
        style={style}
      >
        { children }
      </PureFlexMotion>
    ) : (
      <PureStaticChild
        className={className}
        onClick={this.handleOnClick}
        onKeyDown={this.handleKeyDown}
        ref={flexRef}
        style={this.childStyle}
      >
        { children }
      </PureStaticChild>
    );

  }
}

AnimatedFlexbox.defaultProps = {
  children: [],
  className: '',
  flexBasis: 0.15,
  onClick: null,
  onKeyDown: null,
  style: {},
};

AnimatedFlexbox.propTypes = {
  backgroundRotation: PropTypes.number.isRequired,
  isRootNode: PropTypes.bool.isRequired,
  onClick: ofFuncTypeOrNothing,
  onKeyDown: ofFuncTypeOrNothing,
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
