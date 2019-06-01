import React, { PureComponent } from 'react';
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
  id,
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

  // defaultSpringConfig = { stiffness: 170, damping: 20 };

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

  calcPixels = (percentage) => {
    return percentage * this.parentWidth;
  }

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
    // console.log('motionStyle', motionStyle);
    return motionStyle;
    // return { width: spring(flexBasis, this.getSpringConfig()) };
    // return { flex: spring(flexBasis, this.getSpringConfig()) };
  }

  handleOnClick = (e) => {
    if (e.target.type !== 'button') {
      e.stopPropagation();
      this.props.onClick(e);
    }
  }

  handleKeyDown = (e) => {
    e.stopPropagation();
    if (e.keyCode === 13) {
      this.props.onKeyDown(e);
    }
  }

  render() {
    const {
      id,
      children,
      className,
      flexRef,
      isRootNode,
      onClick,
      onKeyDown,
      style
    } = this.props;
    return !isRootNode ? (
      <PureFlexMotion
        id={id}
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
