# react-scroll-collapse
Component wrappers for auto-scrolling collapsible elements - with smooth animations powered by [react-motion](https://github.com/chenglou/react-motion) and [react-collapse](https://github.com/nkbt/react-collapse).

**Warning:** This is currently an unstable beta release and probably not ready
for production.  Development is ongoing and feedback is welcome.

## Demo

https://danhaggard.github.io/react-scroll-collapse/examples/

## Installation

### NPM
```
npm install --save react-scroll-collapse
```

#### Installing peer dependencies
If you use npm@3 you'll need to install the peer dependencies

```
npm install --save classnames react react-collapse react-dom react-height react-motion react-redux redux redux-saga reselect
```

### redux Integration

react-scroll-collapse relies on [Redux](https://github.com/reactjs/redux) for state management.

#### Importing the reducers:
```
import {reactScrollCollapse} from 'react-scroll-collapse';
```

You will need to include the 'reactScrollCollapse' reducer in your top level reducer with the same state key (i.e. reactScrollCollapse).  [See example](https://github.com/danhaggard/react-scroll-collapse/examples/reducers/index.js)


### redux-saga Integration

react-scroll-collapse also relies on [redux-saga](https://github.com/yelouafi/redux-saga)

#### Importing the sagas:
```
import {reactScrollCollapseSagas} from 'react-scroll-collapse';
```

You will need to include 'reactScrollCollapseSagas' in your root saga - [See example](https://github.com/danhaggard/react-scroll-collapse/blob/master/examples/sagas/index.js) - which in turn must be included in your redux middleware [See example](https://github.com/danhaggard/react-scroll-collapse/blob/master/examples/stores/index.js)


Consult both the redux and redux-saga docs for more information about installing
and using those libraries.


## Overview

react-scroll-collapse provides a scrolling container (<Scroller>) and two higher order components (collapserController, collapserControllerItem) which provide props
and callbacks to use when designing your react-collapse based components.

Scroller will auto-scroll your nested components to the top when they are wrapped
with either the collapserController or collapserControllerItem HoCs.

collapserController provides controls to expand/collapse all child components
wrapped with collapserControllerItem.

collapserControllerItem provides controls to expand/collapse a single element.


### <Scroller>

#### Usage

```
import Scroller from 'react-scroll-collapse';

//...

<Scroller>
  ...
  <YourComponent - wrapped by collapserController>
    ...
    <AnotherComponent - wrapped by collapserControllerItem />
  </YourComponent>
</Scroller>
```

You can see this component implemented in the examples folder [here](https://github.com/danhaggard/react-scroll-collapse/blob/master/examples/components/App.js)

Note - Scrollers seem to be nestable - but I haven't tested this extensively.


#### Props

##### springConfig : PropTypes.object (default: {stiffness: 170, damping: 20})

Scroller makes use of [react-motion](https://github.com/chenglou/react-motion) to
perform the scrolling animation.  You can change the style of animation using
the springConfig prop.  Consult the react-motion docs on using animation springs.

##### className, style

You can use the usual react className and style props to style the component.  A
default style is applied using css modules:

```
:local(.scroller) {
  overflow: auto;
  position: relative;
}
```

It is possible to overwrite this default - but will probably break things.

The scroll to top functionality relies on the <Scroller> DOM element being the first relatively positioned parent.  Other then this limitation - wrapped child
collapserController and collapserItemController elements can be as deeply nested in other components as you like.


### collapserController()

collapserController provides controls to expand/collapse all child components
wrapped with collapserControllerItem.

Components wrapped with collapserController must be a child of the Scroller
component (but do not have to be immediate children).

You can nest wrapped collapserController components within other collapserController components (again they don't have to be immediate children).

But - at the moment - you can't nest them within components wrapped with the
collapserItemController wrapper.  (Well - you can try!)

#### Usage
```
import {collapserController} from 'react-scroll-collapse';

class YourComponent extends Component {

  ...

  render() {
    return (
      <div>
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


#### Props

Because it's a HoC wrapper - collapserController passes props to your component.


##### expandCollapseAll : PropTypes.func

Calling this function in your component will expand/collapse any components
wrapped with the collapserItemController HoC; scrolling your component to the
top of the scroller.

If some children are expanded and some collapsed then it will expand them all.


##### areAllItemsExpanded : PropTypes.bool

A boolean telling your component if all the child collapserItems are expanded.
Use this to display information to the user about whether it will expand its
children or close them the next time expandCollapseAll is called.

If areAllItemsExpanded is true, then the next call will collapse all expand
children - otherwise it will expand all children.


##### collapserId, parentCollapserId, parentScrollerId : PropTypes.number

These are the ids used in redux to track components.


### collapserControllerItem()

collapserControllerItem provides controls to expand/collapse a single component
that uses the [react-collapse](https://github.com/nkbt/react-collapse) <Collapse>
component.  The actual collapse/expand animation is handled by <Collapse> so
consult its docs for usage information.

All components wrapped with collapserControllerItem need to be a child of a
component wrapped with collapserController.

#### Usage
```
import Collapse from 'react-collapse';
import {collapserControllerItem} from 'react-scroll-collapse';

class YourComponent extends Component {

  ...

  render() {
    const {isOpened, onHeightReady, expandCollapse} = this.props;
    return (
      <div onClick={expandCollapse}>
        ...
        <Collapse
          isOpened={isOpened}
          onHeightReady={onHeightReady}
        >
          ...nested components
        </Collapse>
        ...
      </div>
    );
  }
}

export default collapserItemController(YourComponent);
```

You can see full implementations of the wrapper in the [SimpleComment component example](https://github.com/danhaggard/react-scroll-collapse/blob/master/examples/components/SimpleComment/index.js) and the [Comment component example](https://github.com/danhaggard/react-scroll-collapse/blob/master/examples/components/Comment/index.js)


#### Props

Because it's a HoC wrapper - collapserItemController passes props to your component.

##### isOpened : PropTypes.bool

A boolean to pass into the <Collapse> component (also uses isOpened) which controls the expanded state.

##### expandCollapse : PropTypes.func

Flips the value of the isOpened boolean - and scrolls your component to the top of the <Scroller> component.

##### onHeightReady : PropTypes.func

A callback that MUST be passed into the <Collapse> component (also as the
  onHeightReady prop) - otherwise the auto-scroll won't work.

##### itemId, parentCollapserId, parentScrollerId : PropTypes.number

These are the ids used in redux to track components.

## Development
### Running the example demo

```
git@github.com:danhaggard/react-scroll-collapse.git
cd react-scroll-collapse
npm install
npm start
```

### Testing

To run the tests and view coverage:

```
npm test
```
