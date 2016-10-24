import React, {PropTypes, Component} from 'react';
import styles from './Scroller.scss';
import classnames from 'classnames';

class Scroller extends Component {

  // The scroller wrapper will pass in an interpolated scrollTop value for
  // the scroll animation.  Once the update is successful, we make sure the dom
  // object matches.
  componentDidUpdate(prevProps) {
    const {elem} = this;
    if (elem && this.props.scrollTop !== undefined
        // sometime this component will re-render when the winder is resized
        // caused by the Responsive component used a parent.
        // the follow check prevents it from changing the current scrollTop
        // value in such cases (as it can cause a sudden jump)
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

  render() {
    /*
      The use of a ref here allows us to define a method on the component
      that returns the scrollTop property of the corresponding dom object.

      But the cool thing is that this is that it will make this method accessible
      to the ScrollerMotion HoC that will wrap this component so as to add the
      auto scroll animation.  ScrollerMotion will pass this method to the sagas
      handling the control flow so they can access the scrollTop value when
      it's needed. No other methods are exposed.
    */
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
