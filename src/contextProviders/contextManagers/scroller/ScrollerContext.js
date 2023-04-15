/* eslint-disable react/no-unused-state */
import React from 'react';

const scrollerContext = (Base) => {

  class ScrollerContext extends Base {

    currentChildElem = null;

    ref = React.createRef();

    /* reusing this object helps avoid some rerenders */
    resetMotionStyleObj = { needsReset: true, y: 0 };

    /*
      userScrollActive: used to give back scroll control to the user.
      Set to true so event handlers do not fire until animation starts.
      Kept outside react state to prevent unecessary renders.
    */
    userScrollActive = null;

    constructor(props, context) {
      super(props, context);
      this.setChildContext();
      this.setReactScrollCollapse();
    }

    state = { providerMotionStyle: this.resetMotionStyleObj };

    /*
      Relying on the clearing of the previous child element to prevent
      render loop.
    */
    componentDidUpdate() {
      if (this.currentChildElem && this.userScrollActive !== null) {
        this.startScrollAnimation();
        this.currentChildElem = null;
      }
      this.userScrollActive = false;
    }

    getRef = () => this.ref;

    getElem = () => this.getRef().current;

    /* get the distance of the scroll component from the top of the viewport */
    getRectTop = el => (el ? el.getBoundingClientRect().top : null);

    /*
      scrollTop is the amount the scroll container has been scrolled.
      i.e. how far down is the scroll wheel?
    */
    getScrollTop = el => (el ? el.scrollTop : null);

    getUserScrollActive = () => (this.userScrollActive || this.userScrollActive === null);

    setUserScrollActive = val => (this.userScrollActive = val);

    /*
      Used by ScrollerMotion in the child render of react motion.
    */
    setScrollTop = (val) => {
      const el = this.getElem();
      if (el && val >= 0) {
        el.scrollTop = val;
      }
    };

    startScrollAnimation = (needsReset = false) => this.setState({
      providerMotionStyle: this.getMotionStyle(needsReset),
    });


    /*
      Get the difference of distance of both parent and child from the top of
      viewport.  This is the total distance the child has to travel up.

      positive scrollTop value effectively tell you how much the child has already
      scrolled towards the top.  So we reduce the final distance by that amount.
    */
    getChildDistanceToTop = (childEl) => {
      const el = this.getElem();
      return this.getRectTop(childEl) - this.getRectTop(el) + this.getScrollTop(el);
    };

    /*
      External components using method from the context pass as child element.

      We can't scroll immediately because user scrolling might have changed
      the starting position that react motion last used.  So we first make
      sure everything is in sync.
    */
    scrollToTop = (childElem) => {
      this.currentChildElem = childElem;
      this.resetMotionStyle();
    };

    getMotionStyle = (needsReset = false) => ({
      needsReset,
      y: this.getChildDistanceToTop(this.currentChildElem),
    });

    checkReset = () => {
      const { providerMotionStyle: { y } } = this.state;
      const nextY = this.getScrollTop(this.getElem());
      const childDistance = this.getChildDistanceToTop(this.currentChildElem);
      /* User hasn't clicked anything yet and hasn't scrolled and we aren't at the top already */
      if (this.userScrollActive === null && nextY === 0) {
        this.startScrollAnimation();
        return [false, null];
      }

      /*
        If y !== nextY then we're out of sync - refresh,
        but dont waste a render if we don't need to scroll.
      */
      if (y !== nextY && childDistance !== nextY) {
        return [true, nextY];
      }

      /*
        If y === nextY and we do need to scroll - don't bother
        doing a refresh - everything is in sync - just start the animation.

        Note: before delaying scroll to after flex onRest, previously did:

          this.startScrollAnimation(true);
          return [true, null];

        With the justification:

          Passing a true value to needsReset because it puts state at where
          it would be otherwise.

        Don't know if was just an un-noticed bug or caused by change to
        scrollTop call timing, but the above code would cause scrollerMotion
        to pass a value of null for y into react-motion which caused a hard fail.
      */
      if (y === nextY && childDistance !== nextY) {
        this.startScrollAnimation();
        return [false, null];
      }

      /*
        Remainder is equvalent to y === nextY and nextY  === childDistance.
        We don't need to scroll.
      */
      return [false, null];
    }

    /*
      Get the current scrollTop value and pass it into react motion to reset
      the current user scroll state.

      Because we set needsReset to true, ScrollMotion just passes a number
      into react motion - not a spring.  So react motion just calls our
      child render function once with that value without interpolation - and this
      value is already what the scroll state currently is.

      In fact I don't even pass this is because I have the event scroll listeners
      active anyway - so I know if it's just a UI state sync.
    */
    resetMotionStyle = () => {
      const [resetNeeded, y] = this.checkReset();
      if (resetNeeded) {
        this.setState({ providerMotionStyle: { needsReset: true, y } });
      }
    }

    contextMethods = {
      scroller: {
        getElem: this.getElem,
        getUserScrollActive: this.getUserScrollActive,
        getRef: this.getRef,
        setUserScrollActive: this.setUserScrollActive,
        scrollToTop: this.scrollToTop,
        setScrollTop: this.setScrollTop,
      }
    }

  }

  ScrollerContext.whyDidYouRender = {
    logOnDifferentValues: false,
    customName: 'ScrollerContext'
  };

  return ScrollerContext;
};

export default scrollerContext;
