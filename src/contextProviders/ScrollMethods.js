import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { spring } from 'react-motion';

import {
  getOffsetTopRoot,
  getScrollTopRoot,
  getToggleScrollRoot
} from '../selectors/scroller';

class ScrollMethods extends PureComponent {

  currentChildElem = null;

  ref = React.createRef();

  /*
  constructor(props, context) {
    super(props, context);
    this.contextMethods = {
      getCurrentChildDistance: this.getCurrentChildDistance,
      setCurrentChildDistance: this.setCurrentChildDistance,
      getElem: this.getElem,
      getRef: this.getRef,
      getRectTop: this.getRectTop,
      getScrollTop: this.getScrollTop,
      setScrollTop: this.setScrollTop,
      getChildDistanceToTop: this.getChildDistanceToTop,
      scrollChildToTop: this.scrollChildToTop,
    };
  }
  */

  constructor(props, context) {
    super(props, context);
    this.contextMethods = {
      ...this
    };
    this.state = {
      // childDistanceToTop: -1,
      motionStyle: { y: 0 },
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.currentChildElem) {
      this.setState({
        motionStyle: this.getMotionStyle(),
      });
      this.currentChildElem = null;
    }
  }

  getRectTopElem = elem => elem.getBoundingClientRect().top;

  getRef = () => this.ref;

  getElem = () => this.getRef().current;

  getRectTop = () => {
    const elem = this.getElem();
    return elem ? this.getRectTopElem(elem) : null;
  }

  getScrollTop = () => {
    const elem = this.getElem();
    return elem ? elem.scrollTop : null;
  }

  setScrollTop = (val) => {
    const elem = this.getElem();
    if (elem && val >= 0) {
      elem.scrollTop = val;
    }
    return null;
  };

  getChildDistanceToTop = (childElem) => {
    const childRectTop = this.getRectTopElem(childElem);
    const rectTop = this.getRectTop();
    const scrollTop = this.getScrollTop();
    return childRectTop - rectTop + scrollTop;
  }

  setChildDistanceToTop = (childElem) => {
    this.currentChildElem = childElem;
    this.resetMotionStyle();
  }

  /*
  getMotionStyle = () => ({
    y: spring(
      this.getScrollTo(),
      this.getSpringConfig(this.props)
    )
  });
  */
  getMotionStyle = () => ({
    y: spring(
      this.getChildDistanceToTop(this.currentChildElem),
      { stiffness: 170, damping: 20 }
    )
  });

  resetMotionStyle = () => this.setState({ motionStyle: { y: this.getScrollTop() } });

  scrollChildToTop = (childRef) => {
    this.setScrollTop(this.getChildDistanceToTop(childRef));
  }

}

export default ScrollMethods;
