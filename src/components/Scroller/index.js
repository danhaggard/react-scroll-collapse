import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
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
  the sagas to be called when needed.
*/

class Scroller extends Component {

  getClassName(className) {
    const initClassName = {};
    initClassName[styles.scroller] = true;
    return classnames({
      ...initClassName,
    }, className);
  }

  /*
    Defining methods in the ref allows ScrollerMotion to use them when
    wrapping Scroller.
  */
  render() {
    const { className, children, style } = this.props;
    return (
      <div
        className={this.getClassName(className)}
        style={style}
        ref={(elemArg) => {
          this.elem = elemArg;
          this.getScrollTop = () => (this.elem ? this.elem.scrollTop : null);
          this.setScrollTop = (val) => {
            if (this.elem && val >= 0) {
              this.elem.scrollTop = val;
            }
            return null;
          };
        }}
      >
        { children }
      </div>
    );
  }
}

Scroller.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  scrollerId: PropTypes.number.isRequired,
  style: PropTypes.object,
};

export default Scroller;
