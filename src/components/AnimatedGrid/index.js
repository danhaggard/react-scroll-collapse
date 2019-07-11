import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Motion, spring } from 'react-motion';
import forwardRefWrapper from '../../utils/forwardRef';
import { DEFAULT_MOTION_SPRING } from '../../const';
import { ofChildrenType, ofFuncTypeOrNothing } from '../../utils/propTypeHelpers';
import { forEachNumber } from '../../utils/arrayUtils';

const StaticChild = React.forwardRef(({
  children,
  className,
  onClick,
  style,
  onKeyDown,
  // onPointerEnter,
  // onPointerLeave,
  // onPointerOver,
}, ref) => (
  <div
    className={className}
    onClick={onClick}
    ref={ref}
    style={style}
    role="button"
    tabIndex={0}
    onKeyDown={onKeyDown}
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

const FlexMotion = React.forwardRef(({ // eslint-disable-line
  className,
  children,
  getInterpolatedStyle,
  motionStyle,
  onClick,
  onKeyDown,
  // onPointerEnter,
  // onPointerLeave,
  // onPointerOver,
  style,
}, ref) => (
  <Motion
    style={motionStyle}
    onClick={onClick}
  >
    {
      (interpolatedStyle) => {
        const newStyle = {
          ...style,
          ...getInterpolatedStyle(interpolatedStyle)
        };
        return (
          <PureStaticChild
            className={className}
            ref={ref}
            style={newStyle}
            onClick={onClick}
          //  onPointerEnter={onPointerEnter}
          //  onPointerLeave={onPointerLeave}
          //  onPointerOver={onPointerOver}
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

class AnimatedGrid extends PureComponent { // eslint-disable-line

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

  getBackgroundString = val => `linear-gradient(${val}deg, #ddffab, #abe4ff, #d9abff)`

  getFlexBasisString = pixelInt => `1 1 ${pixelInt}px`;

  getFlexBasisStringPer = per => `1 1 ${per * 100}%`;

  getWidthString = pixelInt => `${pixelInt}px`;

  getWidthStringPer = per => `${per * 100}%`;

  // getWidthStringFr = per => `minmax(200px, ${per}fr)`;

  getWidthStringFr = per => `${per}fr`;

  getEmString = val => `${val}em`;

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

  getInterpolGridColWidthRotation = ({ background, gridColumnGap, marginLeft, marginRight, ...rest }) => {
    const strWidths = Object.values(rest).map(
      width => this.getWidthStringFr(width)
    ).filter(width => (width !== '0%')).join(' ');
    return {
      background: this.getBackgroundString(background),
      gridColumnGap: this.getEmString(gridColumnGap),
      marginLeft: this.getEmString(marginLeft),
      marginRight: this.getEmString(marginRight),
      gridTemplateColumns: strWidths,
    };
  };

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

  getColMotionStyle = () => {
    const {
      backgroundRotation,
      columnsOnMount,
      gridColumnWidths,
      gridColumnGap,
      margins,
    } = this.props;
    const [marginLeft, marginRight] = margins;
    const motionStyle = {
      background: spring(backgroundRotation, this.getSpringConfig()),
      gridColumnGap: spring(gridColumnGap, this.getSpringConfig()),
      marginLeft: spring(marginLeft, this.getSpringConfig()),
      marginRight: spring(marginRight, this.getSpringConfig()),

    };
    gridColumnWidths.forEach((colWidth, index) => {
      motionStyle[`colWidth${index}`] = spring(colWidth, this.getSpringConfig());
    });
    if (gridColumnWidths.length < columnsOnMount.length) {
      forEachNumber(columnsOnMount.length - gridColumnWidths.length, (num) => {
        motionStyle[`colWidth${gridColumnWidths.length + num}`] = spring(0, this.getSpringConfig());
      });
    }
    return motionStyle;
  }

  handleOnClick = (e) => {
    if (!['INPUT', 'BUTTON'].includes(e.target.tagName)) {
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
    We need to detect when mouse enters a nested AnimatedGrid component - so
    we use a dataset attribute to identify AnimatedGrid divs.

    We use currentTarget (which points to the current instance) vs target (the
    child instance to detect movement across the child AnimatedGrid)

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

    return (
      <PureFlexMotion
        // onPointerEnter={this.pointerEnter}
        // onPointerLeave={this.pointerLeave}
        // onPointerOver={this.pointerOver}
        className={className}
        getInterpolatedStyle={this.getInterpolGridColWidthRotation}
        motionStyle={this.getColMotionStyle()}
        onClick={this.handleOnClick}
        onKeyDown={this.handleKeyDown}
        ref={flexRef}
        style={{ ...style, ...stateStyle }}
      >
        { children }
      </PureFlexMotion>
    );

    /*
    return !isRootNode ? (
      <PureFlexMotion
        // onPointerEnter={this.pointerEnter}
        // onPointerLeave={this.pointerLeave}
        // onPointerOver={this.pointerOver}
        className={className}
        getInterpolatedStyle={this.getInterpolGridColWidthRotation}
        motionStyle={this.getColMotionStyle()}
        onClick={this.handleOnClick}
        onKeyDown={this.handleKeyDown}
        ref={flexRef}
        style={{ ...style, ...stateStyle }}
      >
        { children }
      </PureFlexMotion>
    ) : (
      <PureStaticChild
        className={className}
        onClick={this.handleOnClick}
        onKeyDown={this.handleKeyDown}
        ref={flexRef}
        style={style}
      >
        { children }
      </PureStaticChild>
    );
    */
  }
}

AnimatedGrid.defaultProps = {
  children: [],
  className: '',
  flexBasis: 0.15,
  onClick: null,
  onKeyDown: null,
  style: {},
};

AnimatedGrid.propTypes = {
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

AnimatedGrid.whyDidYouRender = {
  logOnDifferentValues: false,
  customName: 'AnimatedGrid'
};

const AnimatedGridRef = forwardRefWrapper(AnimatedGrid, 'flexRef');

export default AnimatedGridRef;
