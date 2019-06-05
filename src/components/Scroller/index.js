import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { ofChildrenType } from '../../utils/propTypeHelpers';
import { targetIsScrollBar } from '../../utils/domUtils';
import { setContextAttrs } from '../../utils/objectUtils';


/*
  <Scroller> renders a <div>. that will overflow and scroll using
  styles.scroller as the css class.

  The bigger picture is that it will be rendered by <ScrollerMotion> which
  uses react-motion to pass an interpolated series of values for the scrollTop
  prop.  Scroller uses this to set the dom node scrollTop property - thus creating
  the animation.

  Scroller.getClassName adds any classNames supplied via props.  So
  styles.scroller can be over-written if desired - which could break
  the css potentially.  I prefer to err on the side of freedom though.

  Scroller.getScrollTop is a callback defined that returns the
  scrollTop property of the dom element.  It is passed by ScrollerMotion to
  the sagas to be called when needed.str.slice(0, -1);
*/

class Scroller extends PureComponent {

  state = {
    style: {}
  }

  setAttrs = (() => setContextAttrs(this))();

  callIfAnimating = callback => (...args) => { // eslint-disable-line react/sort-comp
    if (!this.props.getUserScrollActive()) {
      callback(...args);
    }
  }

  breakScrollAnimation = condition => condition && this.props.breakScrollAnimation();

  /*
    Break scroll animation on user scroll events:

    keydown (arrow up, arrow down)
    mouse wheel,
    handleMouseDown: click on scrollbar.

    Once the scroll animation has been cancelled - there is no point allowing
    these to be called again until the next animation starts.
  */
  handleMouseDown = this.callIfAnimating(
    e => this.breakScrollAnimation(targetIsScrollBar(e.clientX, this.getElem()))
  );

  handleWheel = this.callIfAnimating(() => this.breakScrollAnimation(true));

  handleKeyDown = this.callIfAnimating(
    e => this.breakScrollAnimation([33, 34, 38, 40].includes(e.keyCode))
  );

  /*
    Experimenting with the will-change property.
  */
  // handlePointerEnter = () => this.setState(() => ({ style: { willChange: 'scroll-position' } }));

  // handlePointerLeave = () => this.setState(() => ({ style: {} }));

  context = this.methods.scroller;

  getElem = this.context.getElem;

  getRef = this.context.getRef;

  getProps = ({
    children,
    className,
    style
  }) => {
    const newProps = {
      children,
      className,
      onKeyDown: this.handleKeyDown,
      onMouseDown: this.handleMouseDown,
      onWheel: this.handleWheel,
      // onPointerEnter: this.handlePointerEnter,
      // onPointerLeave: this.handlePointerLeave,
      ref: this.getRef(),
      role: 'presentation',
      style: {
        overflow: 'auto',
        postion: 'relative',
        ...this.state.style,
        ...style
      },
    };
    return newProps;
  };

  render = () => <div {...this.getProps(this.props)} />;
}

Scroller.defaultProps = {
  children: [],
  className: '',
  style: {},
};

Scroller.propTypes = {
  breakScrollAnimation: PropTypes.func.isRequired,
  children: ofChildrenType,
  className: PropTypes.string,
  getUserScrollActive: PropTypes.func.isRequired,
  style: PropTypes.object,
};

Scroller.whyDidYouRender = {
  logOnDifferentValues: false,
  customName: 'Scroller'
};

export default Scroller;
