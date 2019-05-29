/* eslint-disable react/no-unused-state */
import React, { PureComponent } from 'react';

class ScrollerContext extends PureComponent {

  currentChildElem = null;

  ref = React.createRef();

  constructor(props, context) {
    super(props, context);
    this.contextMethods = {
      scroller: {
        getElem: this.getElem,
        getRef: this.getRef,
        scrollToTop: this.scrollToTop,
        setScrollTop: this.setScrollTop,
      }
    };
    this.state = {
      providerMotionStyle: {
        needsReset: true,
        y: 0
      },
    };
  }

  componentDidUpdate() {
    if (this.currentChildElem) {
      this.setState({  // eslint-disable-line
        providerMotionStyle: this.getMotionStyle(),
      });
      this.currentChildElem = null;
    }
  }

  getRef = () => this.ref;

  getElem = () => this.getRef().current;

  getRectTop = el => (el ? el.getBoundingClientRect().top : null);

  getScrollTop = el => (el ? el.scrollTop : null);

  setScrollTop = (val) => {
    const el = this.getElem();
    if (el && val >= 0) {
      el.scrollTop = val;
    }
  };

  getChildDistanceToTop = (childEl) => {
    const el = this.getElem();
    return this.getRectTop(childEl) - this.getRectTop(el) + this.getScrollTop(el);
  };

  scrollToTop = (childElem) => {
    this.currentChildElem = childElem;
    this.resetMotionStyle();
  };

  getMotionStyle = () => ({
    needsReset: false,
    y: this.getChildDistanceToTop(this.currentChildElem),
  });

  resetMotionStyle = () => this.setState({
    providerMotionStyle: {
      needsReset: true,
      y: this.getScrollTop(this.getElem()),
    }
  });

}

ScrollerContext.whyDidYouRender = {
  logOnDifferentValues: false,
  customName: 'ScrollerContext'
};

export default ScrollerContext;
