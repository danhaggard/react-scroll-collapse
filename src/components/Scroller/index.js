import React, {PropTypes, Component} from 'react';
import styles from './Scroller.scss';
import classnames from 'classnames';


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

  /*
    componentDidUpdate ensures that the dom element's scrollTop value matches
    what was passed in through props in the previous update.
  */
  componentDidUpdate(prevProps) {
    const {elem} = this;
    if (elem && this.props.scrollTop !== undefined
        /*
          Only update elem.scrollTop if parent sends new value through props.

          See: https://github.com/danhaggard/react-scroll-collapse/issues/2#issue-186472122
        */
        && this.props.scrollTop !== prevProps.scrolltop
      ) {
      elem.scrollTop = this.props.scrollTop;
    }
  }

  getClassName(className) {
    const initClassName = {};
    initClassName[styles.scroller] = true;
    return classnames({
      ...initClassName,
    }, className);
  }

  /*
    Defining the getScrollTop method in the ref allows ScrollerMotion to use this
    method when wrapping Scroller.
  */
  render() {
    const {className, children, style} = this.props;
    return (
      <div
        children={children}
        className={this.getClassName(className)}
        style={style}
        ref={elem => {
          this.elem = elem;
          this.getScrollTop = () => (elem ? elem.scrollTop : null);
        }}
      />
    );
  }
}

Scroller.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  scrollerId: PropTypes.number.isRequired,
  scrollTop: PropTypes.number.isRequired,
  style: PropTypes.object,
};

export default Scroller;
