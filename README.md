# react-scroll-collapse
Component wrappers for auto-scrolling collapsible elements - with smooth animations powered by [react-motion](https://github.com/chenglou/react-motion) and [react-collapse](https://github.com/nkbt/react-collapse).

## Demo

https://danhaggard.github.io/react-scroll-collapse/examples/

## What's New!

16th April 2023

### Version 2 Release!

#### WARNING! V2 is Experimental.  Advise use 1.4.1 [readme v1.4.1](https://danhaggard.github.io/react-scroll-collapse/README_v1-4-1.md)

This release has breaking changes:

- The redux-saga dependency has been removed.
- "offsetScrollTo" prop in Scroller renamed to "scrollOffset"
- "collapserId", "parentCollapserId", "parentScrollerId" props passed by collapserController to wrapped components have been removed. See _reactScrollCollapse prop for replacements.
- "itemId", "parentCollapserId", "parentScrollerId" props passed by collapserController to wrapped components have been removed. See _reactScrollCollapse prop for replacements.

Other notable differences:

- Scroller no longer needs to be the first relatively positioned parent.

## Overview

react-scroll-collapse provides a scrolling container (<Scroller>) and two higher order components (collapserController, collapserControllerItem) which provide props and callbacks to use when designing your react-collapse based components.

Scroller will auto-scroll your nested components to the top when they are wrapped with either the collapserController or collapserControllerItem HoCs.

collapserController provides controls to expand/collapse all child components wrapped with collapserControllerItem.

collapserControllerItem provides controls to expand/collapse a single element.

## Installation

### NPM
```bash
npm install --save react-scroll-collapse
```

#### Installing peer dependencies
If you use npm@3 you'll need to install the peer dependencies

```bash
npm install --save classnames react react-collapse react-dom react-height react-motion react-redux redux
```

### redux Integration

react-scroll-collapse relies on [Redux](https://github.com/reactjs/redux) for state management.

#### Importing the reducers:
```javascript
import {reactScrollCollapse} from 'react-scroll-collapse';
```

You will need to include the 'reactScrollCollapse' reducer in your top level reducer with the same state key (i.e. reactScrollCollapse).  [See example](https://github.com/danhaggard/react-scroll-collapse/blob/master/examples/reducers/index.js)


## Components

### \<AnimatedFlexbox>

Experimental Animated Flex Component.  Production use not advised.

```javascript
import { AnimatedFlexbox } from 'react-scroll-collapse';
```

[See example usage](https://github.com/danhaggard/react-scroll-collapse/blob/master/examples/components/CommentThreadFlex/index.js)

### \<Scroller>

#### Usage

For the auto-scroll functionality to work, components wrapped with collapserController should be nested within the scope of \<Scroller>.  collapserControllerItem wrapped components should be nested in the scope of a component wrapped with collapserController.

```javascript
import Scroller from 'react-scroll-collapse';

//...

<Scroller>
  ...
  <YourComponent - wrapped by collapserController>  // nested under Scroller
    ...
    <AnotherComponent - wrapped by collapserControllerItem />  // nested under a collapserController
  </YourComponent>

  or...

  <YourComponent - wrapped by collapserController>  // nested under Scroller
    ...
    <AnotherComponent - wrapped by collapserControllerItem />  // nested under a collapserController
    <ThirdComponent wrapped by collapserController> // you can nest collapserControllers under each other
      <FourthComponent wrapped by collapserControllerItem />
    </ThirdComponent>
  </YourComponent>

</Scroller>
```

You can see this component implemented in the examples folder [here](https://github.com/danhaggard/react-scroll-collapse/blob/master/examples/components/App.js).


#### \<Scroller> - Props

##### autoScrollDisabled : PropTypes.bool (default: false)

##### onAnimationCancel : PropTypes.function

This callback will be fired when the user cancels the scroll animation by initiating a scroll event of their own.

##### onRest : PropTypes.function

Scroller makes use of the [react-motion](https://github.com/chenglou/react-motion) <Motion> component to perform the scrolling animation.  The onRest prop is passed directly into the <Motion> component.  It is a callback that is fired when the animation is finished.  Consult the react-motion docs for more information.

##### scrollTo : PropTypes.number

Scroller will scroll to the offsetTop value of the nested collapserControllerItem that has its expandCollapse function called.  You can over ride this completely by setting a value for this prop.

##### scrollOffset : PropTypes.number

Alternatively you can set an offset that will be added to the offsetTop value.

##### scrollOnOpen : PropTypes.bool (default: true)

If true Scroller will auto scroll collapserItem on call of expandCollapse when collapserItem is
being opened (going from closed to open state).

##### scrollOnClose : PropTypes.bool (default: true)

If true Scroller will auto scroll collapserItem on call of expandCollapse when collapserItem is
being closed (going from open to closed state).

##### springConfig : PropTypes.object (default: {stiffness: 170, damping: 20})

You can change the style of animation using the springConfig prop.  Consult the react-motion docs on using animation springs.

##### className, style

You can use the usual react className and style props to style the component.  A default style is applied:

```
{
  overflow: auto;
  position: relative;
}
```

It is possible to overwrite this default - but will probably break things.

## Component HoC Wrappers

### collapserController()

collapserController provides controls to expand/collapse all child components wrapped with collapserControllerItem.  Components wrapped with collapserController must be a child of a Scroller component (but do not have to be immediate children).

You can nest wrapped collapserController components within other collapserController components (again - they don't have to be immediate children). But - at the moment - you can't nest them within components wrapped with the collapserItemController wrapper.

collapserController will pass a 'collapserRef' prop.  You must pass this as the 'ref' attribute on the DOM node you want the scroll to top animation to be applied.

#### Usage
```javascript
import {collapserController} from 'react-scroll-collapse';

class YourComponent extends Component {

  ...

  render() {
    return (
      <div
        ref={this.props.collapserRef} // Don't forget to pass this ref!!!
      >
        ...
        <Component - wrapped by collapserItemController />
        <Component - wrapped by collapserItemController />
        ...
      </div>
    );
  }
}

export default collapserController(YourComponent);
```

You can see full implementations of the wrapper in the [SimpleCollapser component example](https://github.com/danhaggard/react-scroll-collapse/blob/master/examples/components/SimpleCollapser/index.js) and the [CommentThread component example](https://github.com/danhaggard/react-scroll-collapse/blob/master/examples/components/CommentThread/index.js)


#### collapserController - Passed Props

Because it's a HoC wrapper - collapserController passes the following props to your component.

##### areAllItemsExpanded : PropTypes.bool

A boolean telling your component if all the child collapserItems are expanded. Use this to display information to the user about whether it will expand its children or close them the next time expandCollapseAll is called.

If areAllItemsExpanded is true, then the next expandCollapseAll call will collapse all expand children - otherwise it will expand all children.

##### collapserRef : PropTypes.object

Is a ref object as created by React.createRef - you must pass this as the 'ref' attribute to a DOM node.

##### expandCollapseAll : PropTypes.func

Calling this function in your component will scroll your component to the top of the parent <Scroller> component and expand/collapse any components wrapped with the collapserItemController HoC nested within the scope of the collapserController.

If some children are expanded and some collapsed then it will expand them all.


##### _reactScrollCollapse: 

```
{
  id: number,
  parents: { collapser: number }
  rootNodes: {scroller: number, collapser: number}
}
```

These are the ids used in redux to track components.  Note if your component is not nested within a Scroller or collapser then attrs under parents, rootNodes will be undefined.


### collapserControllerItem()

collapserControllerItem provides controls to expand/collapse a single component that uses the [react-collapse](https://github.com/nkbt/react-collapse) <Collapse> component.  The actual collapse/expand animation is handled by <Collapse> so consult its docs for usage information.

collapserControllerItem will pass a 'collapserItemRef' prop.  You must pass this as the 'ref' attribute on the DOM node you want the scroll to top animation to be applied.

#### Usage
```javascript
import Collapse from 'react-collapse';
import {collapserControllerItem} from 'react-scroll-collapse';

class YourComponent extends Component {

  ...

  render() {
    const {isOpened, onHeightReady, expandCollapse} = this.props;
    return (
      <div
        onClick={expandCollapse} // use expandCollapse as an event callback.
        ref={collapserItemRef} // pass the supplied ref or auto scroll won't work.
      >
        ...
        <Collapse isOpened={isOpened}> // make sure you pass the isOpened prop to <Collapse> !!
          ...nested components
        </Collapse>
        ...
      </div>
    );
  }
}

export default collapserItemController(YourComponent);
```

All components wrapped with collapserControllerItem need to be a child of a component wrapped with collapserController.  However, if you don't need to have multiple children of a particular collapserController then you don't need to create an additional component just to serve as the input for collapserController.

You can just wrap your collapserControllerItem immediately upon export like so:

```javascript
import {collapserController, collapserControllerItem} from 'react-scroll-collapse';

class YourComponent extends Component {

  ...(your inner component stuff)

}

export default collapserControler(ItemController(YourComponent));  // wrap the item immediately with collapserController!
```

You can see full implementations of the wrapper in the [SimpleComment component example](https://github.com/danhaggard/react-scroll-collapse/blob/master/examples/components/SimpleComment/index.js) and the [Comment component example](https://github.com/danhaggard/react-scroll-collapse/blob/master/examples/components/Comment/index.js)


#### collapserControllerItem - Passes Props

Because it's a HoC wrapper - collapserItemController passes props to your component.

##### collapserItemRef : PropTypes.object

Is a ref object as created by React.createRef - you must pass this as the 'ref' attribute to a DOM node.

##### isOpened : PropTypes.bool

A boolean to pass into the <Collapse> component (also uses isOpened) which controls the expanded state.

##### expandCollapse : PropTypes.func

Flips the value of the isOpened boolean - and scrolls your component to the top of the <Scroller> component.

##### _reactScrollCollapse: 

```
{
  id: number,
  parents: { collapser: number }
  rootNodes: {scroller: number, collapser: number}
}
```

These are the ids used in redux to track components.

## Development
### Running the example demo

```bash
git clone https://github.com/danhaggard/react-scroll-collapse.git
cd react-scroll-collapse
npm install
npm start
```

Demo content will be served at http://localhost:8080

### Testing

To run the tests:

```bash
npm test
```

Coverage is found in ./test/coverage/lcov-report

## Acknowledgements

### generator-react-webpack-redux

The original template for the project came from [generator-react-webpack-redux](https://github.com/stylesuxx/generator-react-webpack-redux)
