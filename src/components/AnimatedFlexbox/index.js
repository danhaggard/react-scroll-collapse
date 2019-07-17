import React, { PureComponent, useContext } from 'react';
import PropTypes from 'prop-types';
import { Motion, spring } from 'react-motion';
import forwardRefWrapper from '../../utils/forwardRef';
import { DEFAULT_MOTION_SPRING } from '../../const';
import { ofChildrenType, ofFuncTypeOrNothing } from '../../utils/propTypeHelpers';
import { CONTEXTS } from '../../contextProviders/constants';

const StaticChild = React.forwardRef(({
  children,
  className,
  // onClick,
  // onDoubleClick,
  style,
  onKeyDown,
  onKeyUp,
  onPointerDown,
  onPointerUp,
  // onPointerEnter,
  // onPointerLeave,
  // onPointerOver,
}, ref) => (
  <div
    className={className}
    onPointerDown={onPointerDown}
    onPointerUp={onPointerUp}
    // onClick={onClick}
    // onDoubleClick={onDoubleClick}
    ref={ref}
    style={style}
    role="button"
    tabIndex={0}
    onKeyDown={onKeyDown}
    onKeyUp={onKeyUp}
    type="button"
    // onPointerEnter={onPointerEnter}
    // onPointerLeave={onPointerLeave}
    // onPointerOver={onPointerOver}
    // data-react-scroll-collapse-flex
  >
    { children }
  </div>
));


StaticChild.whyDidYouRender = {
  logOnDifferentValues: false,
  customName: 'StaticChild'
};

const PureStaticChild = React.memo(StaticChild);

const isHeightFixed = (ref, prevHeight, zeroHeightDiffArr = []) => {
  if (prevHeight === null && ref.current === null) {
    return [false, null, []];
  }

  const nextHeight = ref.current.clientHeight;

  if (prevHeight === null) {
    const { clientWidth } = ref.current;
    // console.log(`id: ${id}, width diff: `, ref.current.parentNode.clientWidth - clientWidth);
    /*
      Covers case where flex child has full width.  170 is a guesstimate value
      of margins and paddings.  Changes with font scaling.

      Could use the newHeightDiffArr check instead - but that does add a little
      delay to calculate height.
    */
    const heightFixed = ref.current.parentNode.clientWidth - clientWidth < 170;
    return [heightFixed, nextHeight, []];
  }

  const heightDiff = 1 - (nextHeight / prevHeight);

  let heightFixed = false;
  let newHeightDiffArr = zeroHeightDiffArr;
  // console.log(`id: ${id}, height diff: `, heightDiff);

  /*
    You will see a drop in height once flex width has been determined and is
    expanding.

    Could also just rely on newHeightDiffArr - but is sometimes quicker.  Is
    trade off between fastest time to parent width vs allowing enough
    time to determine child heights. greater newHeightDiffArr.length allow
    more time to determine child heights.
  */
  if (heightDiff > 0.3) {
    heightFixed = true;
    newHeightDiffArr = [];
  }

  /*
    zeroHeightDiffArr is measuring the number of times that flex width has
    animated a frame without a change in height.
  */
  if (heightDiff === 0) {
    newHeightDiffArr = [...zeroHeightDiffArr, 0];
  }

  /*
    3 - 4 seems to be a good balance between responsiveness and giving react-collapse
    enough time to source its first height value.
  */
  if (newHeightDiffArr.length > 4) {
    heightFixed = true;
  }

  return [heightFixed, nextHeight, newHeightDiffArr];
};

const FlexMotion = React.forwardRef(({ // eslint-disable-line
  className,
  children,
  getInterpolatedStyle,
  motionStyle,
  // onClick,
  // onDoubleClick,
  onPointerDown,
  onPointerUp,
  onKeyDown,
  onKeyUp,
  onRest,
  // id,
  // onPointerEnter,
  // onPointerLeave,
  // onPointerOver, context = useContext(CONTEXTS.MAIN);
  style,
}, ref) => {
  let prevHeight = null;
  let heightFixed = false;
  let zeroHeightDiffArr = [];
  const context = useContext(CONTEXTS.MAIN);
  let finalOnRest = context.contextMethods.collapser.onFlexRest;
  const getFinalOnRest = () => finalOnRest();
  // console.log(`id: ${id}, render-  motionStyle`, motionStyle);
  return (
    <Motion
      style={motionStyle}
      // onClick={onClick}
      onRest={getFinalOnRest}
    >
      {
        (interpolatedStyle) => {

          // console.log(`id: ${id}, TOP: prevHeight, clientHeight, parentHeight`, prevHeight, ref.current && ref.current.clientHeight, ref.current && ref.current.parentNode.clientHeight);
          // console.log(`id: ${id}, TOP: clientWidth, parentWidth`, ref.current && ref.current.clientWidth, ref.current && ref.current.parentNode.clientWidth);

          if (!heightFixed) {
            [heightFixed, prevHeight, zeroHeightDiffArr] = isHeightFixed(
              ref, prevHeight, zeroHeightDiffArr
            );
            // console.log(`id: ${id}, heightFixed, prevHeight, zeroHeightDiffArr`, heightFixed, prevHeight, zeroHeightDiffArr);

            if (heightFixed) {
              // console.log(`id: ${id}, heightFixed`);
              context.contextMethods.collapser.onFlexRest();
              finalOnRest = () => console.log('dummy on rest');
            }
          }
          const newStyle = {
            ...style,
            ...getInterpolatedStyle(interpolatedStyle)
          };
          return (
            <PureStaticChild
              className={className}
              ref={ref}
              style={newStyle}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
            //   onClick={onClick}
            //  onDoubleClick={onDoubleClick}
            //  onPointerEnter={onPointerEnter}
            //  onPointerLeave={onPointerLeave}
            //  onPointerOver={onPointerOver}
              onKeyDown={onKeyDown}
              onKeyUp={onKeyUp}

            >
              { children }
            </PureStaticChild>
          );
        }
      }
    </Motion>
  );
});

FlexMotion.defaultProps = {
  children: [],
  className: '',
  // onClick: null,
  onKeyDown: null,
  onKeyUp: null,
  onRest: null,
  style: {},
};


FlexMotion.propTypes = {
  getInterpolatedStyle: PropTypes.func.isRequired,
  motionStyle: PropTypes.object.isRequired,
  // onClick: ofFuncTypeOrNothing,
  onKeyDown: ofFuncTypeOrNothing,
  onKeyUp: ofFuncTypeOrNothing,
  onRest: ofFuncTypeOrNothing,
  children: ofChildrenType,
  className: PropTypes.string,
  style: PropTypes.object,
};

FlexMotion.whyDidYouRender = {
  logOnDifferentValues: false,
  customName: 'FlexMotion'
};

const PureFlexMotion = React.memo(FlexMotion);

class AnimatedFlexbox extends PureComponent { // eslint-disable-line

  defaultSpringConfig = DEFAULT_MOTION_SPRING;

  willChangeBackground = false;

  willChangeWidth = false;

  state = {
    style: {},
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

  // getBackgroundString = val => `linear-gradient(${val}deg, #ddffab, #abe4ff, #d9abff)`
  // getBackgroundString = val => `linear-gradient(${val}deg, #d9abff, #e5c7ff 45% 55%, #d9abff)`

  getBackgroundString = val => `linear-gradient(${val}deg, #abe4ff, #d2f0ff 45% 55%, #abe4ff)`


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

  handleOnClickBase = clickHandler => (e) => {
    if (!['INPUT', 'BUTTON'].includes(e.target.tagName)) {
      e.stopPropagation();
      clickHandler(e);
    }
  }

  handleOnClick = this.handleOnClickBase(this.props.onClick); // eslint-disable-line

  handleOnDoubleClick = this.handleOnClickBase(this.props.onDoubleClick); // eslint-disable-line

  handleOnPointerDown = this.handleOnClickBase(this.props.onPointerDown); // eslint-disable-line

  handleOnPointerUp = this.handleOnClickBase(this.props.onPointerUp); // eslint-disable-line

  /*
    Remember stopping propagation can break things above.
  */
  handleKeyBase = handler => (e) => {
    if (e.keyCode === 13) {
      e.stopPropagation();
      handler(e);
    }
  }

  handleKeyDown = this.handleKeyBase(this.props.onKeyDown);

  handleKeyUp = this.handleKeyBase(this.props.onKeyUp);

  setWillChange = () => {
    const { willChangeBackground: changeBg, willChangeWidth: changeW } = this;
    if (!(changeBg || changeW)) {
      this.setWontChange();
    } else {
      const bgStr = changeBg ? 'background' : '';
      const widthStr = changeW ? 'width' : '';
      const divStr = (changeBg && changeW) ? ', ' : '';
      const willChangeStr = `${bgStr}${divStr}${widthStr}`;
      this.setState(({ style }) => ({
        style: { ...style, willChange: willChangeStr }
      }));
    }

  }

  setWontChange = () => {
    this.setState(({ style: { willChange, ...rest } }) => ({
      style: { ...rest }
    }));
  }

  /*
    On point hover over the div both width and background can change on click.
    So we tell the browser to anticpate the animations.

    onPointerEnter/leave do not respond to child pointer events.  So it's good
    for setting animations completely on or off.
  */
  pointerEnter = () => {
    this.willChangeWidth = true;
    this.willChangeBackground = true;
    this.setWillChange();
  }

  pointerLeave = () => {
    this.willChangeBackground = false;
    this.willChangeWidth = false;
    this.setWillChange();
  }

  /*
    When hovering over a child flex element - then it's no longer at risk of
    having it's own width changed.

    pointerOver detects any child pointerOver events - no matter how nested.
    We need to detect when mouse enters a nested AnimatedFlexbox component - so
    we use a dataset attribute to identify AnimatedFlexbox divs.

    We use currentTarget (which points to the current instance) vs target (the
    child instance to detect movement across the child AnimatedFlexbox)

    disabling this for now - needs more nuance.
  */
  pointerOver = (e) => {
    if (e.target !== e.currentTarget && e.target.dataset.reactScrollCollapseFlex === 'true') {
      this.willChangeWidth = false;
      this.setWillChange();
    }

    if (e.target === e.currentTarget && e.target.dataset.reactScrollCollapseFlex === 'true') {
      this.willChangeWidth = true;
      this.setWillChange();
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
    const { style: stateStyle } = this.state;
    return !isRootNode ? (
      <PureFlexMotion
        // onPointerEnter={this.pointerEnter}
        // onPointerLeave={this.pointerLeave}
        // onPointerOver={this.pointerOver}
        className={className}
        getInterpolatedStyle={this.getInterpolWidthRotation}
        motionStyle={this.getMotionStyle()}
        // onClick={this.handleOnClick}
        // onDoubleClick={this.handleOnDoubleClick}
        onPointerDown={this.handleOnPointerDown}
        onPointerUp={this.handleOnPointerUp}
        onKeyDown={this.handleKeyDown}
        onKeyUp={this.handleKeyUp}
        ref={flexRef}
        style={{ ...style, ...stateStyle }}
      >
        { children }
      </PureFlexMotion>
    ) : (
      <PureStaticChild
        className={className}
        onPointerDown={this.handleOnPointerDown}
        onPointerUp={this.handleOnPointerUp}
        // onClick={this.handleOnClick}
        onKeyDown={this.handleKeyDown}
        ref={flexRef}
        style={style}
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
