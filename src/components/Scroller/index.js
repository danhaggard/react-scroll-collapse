import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { ofChildrenType } from '../../utils/propTypeHelpers';
import { targetIsScrollBar } from '../../utils/domUtils';
import styles from './Scroller.scss';


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
    e => this.breakScrollAnimation(targetIsScrollBar(e.clientX, this.elem))
  );

  handleWheel = this.callIfAnimating(() => this.breakScrollAnimation(true));

  handleKeyDown = this.callIfAnimating(
    e => this.breakScrollAnimation(e.keyCode === 38 || e.keyCode === 40)
  );

  getClassName = (className) => {
    const initClassName = {};
    initClassName[styles.scroller] = true;
    return classnames({
      ...initClassName,
    }, className);
  }

  getScrollTop = () => (this.elem ? this.elem.scrollTop : null);

  setScrollTop = (val) => {
    if (this.elem && val >= 0) {
      this.elem.scrollTop = val;
    }
    return null;
  };

  render() {
    const { className, children, style } = this.props;
    return (
      <div
        className={this.getClassName(className)}
        onKeyDown={this.handleKeyDown}
        onMouseDown={this.handleMouseDown}
        onWheel={this.handleWheel}
        ref={(elemArg) => {
          this.elem = elemArg;
        }}
        role="presentation"
        style={style}
      >
        { children }
      </div>
    );
  }
}

Scroller.defaultProps = {
  children: [],
  className: '',
  style: {},
};

Scroller.propTypes = {
  children: ofChildrenType,
  className: PropTypes.string,
  breakScrollAnimation: PropTypes.func.isRequired,
  getUserScrollActive: PropTypes.func.isRequired,
  style: PropTypes.object,
};

export default Scroller;
