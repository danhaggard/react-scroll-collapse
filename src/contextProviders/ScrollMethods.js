import React, { PureComponent } from 'react';


class ScrollMethods extends PureComponent {

  ref = React.createRef();

  constructor(props, context) {
    super(props, context);
    this.contextMethods = {
      getElem: this.getElem,
      getRef: this.getRef,
      getRectTop: this.getRectTop,
      getScrollTop: this.getScrollTop,
      setScrollTop: this.setScrollTop,
      getChildDistanceToTop: this.getChildDistanceToTop,
      scrollChildToTop: this.scrollChildToTop,
    };
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

  scrollChildToTop = (childRef) => {
    this.setScrollTop(this.getChildDistanceToTop(childRef));
  }

}

export default ScrollMethods;
