import React, {PropTypes, Component} from 'react';
import styles from './Scroller.scss';


class Scroller extends Component {

  static propTypes = {
    component: PropTypes.string,
    windowInnerHeight: PropTypes.number,
    children: PropTypes.node,
    style: PropTypes.object,
    scrollTop: PropTypes.number,
    actions: PropTypes.object,
    scrollerId: PropTypes.number,
  };

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

  render() {
    const {children, style, windowInnerHeight} = this.props;
    const newHeight = windowInnerHeight === undefined ? 0 : windowInnerHeight - 88;
    return (
      <div
        ref={elem => {
          this.elem = elem;
          this.getScrollTop = () => (elem ? elem.scrollTop : null);
        }}
        className={styles.scroller}
        children={children}
        style={{...style, height: newHeight}}
      />
    );
  }
}

export default Scroller;
