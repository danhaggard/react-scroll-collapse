# react-scroll-collapse
Component wrappers for auto-scrolling with elements using react-collapse

## Demo

## Installation

### NPM
Coming Soon


#### Importing the collapser HoCs:
```
import {collapserController, collapserItemController} from 'react-scroll-collapse';
```

### Redux Integration

react-scroll-collapse relies on [Redux](https://github.com/reactjs/redux) for state management.

#### Importing the reducers:
```
import {reactScrollCollapse} from 'react-scroll-collapse';
```

You will need to include the 'reactScrollCollapse' reducer in your top level reducer with
the same state key.  [See example](https://github.com/danhaggard/react-scroll-collapse/examples/reducers/index.js)


### redux-saga

react-scroll-collapse also relies on [redux-saga](https://github.com/yelouafi/redux-saga)
You will need to include 'reactScrollCollapseSagas' in your root saga - [See example](https://github.com/danhaggard/react-scroll-collapse/blob/master/examples/sagas/index.js) - which in turn must be included in your redux middlewares [See example](https://github.com/danhaggard/react-scroll-collapse/blob/master/examples/stores/index.js)

#### Importing the sagas:
```
import {reactScrollCollapseSagas} from 'react-scroll-collapse';
```

Consult both the redux and redux-saga docs for more information about using those
libraries.


## Overview

react-scroll-collapse provides a scrolling container (<Scroller>) and two higher order components (collapserController, collapserControllerItem) which provide props
and callbacks to use when designing your react-collapse based components.

Scroller will auto-scroll your nested components to the top when they are wrapped
with either the collapserController or collapserControllerItem HoCs.

collapserController provides controls to expand/collapse all child components
wrapped with collapserControllerItem.

collapserControllerItem provides controls to expand/collapse that single element.


### Scroller

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


### collapserController

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

You can see full implementations of the wrapper in the [SimpleCollapser component example](https://github.com/danhaggard/react-scroll-collapse/blob/master/examples/components/SimpleCollapser/index.js) and the [CommmentThread component example](https://github.com/danhaggard/react-scroll-collapse/blob/master/examples/components/CommentThread/index.js)


#### Props

Because it's a HoC wrapper - collapserController passes props to your component.


##### expandCollapseAll : PropTypes.func

Calling this function in your component will expand/collapse any components
wrapped with the collapserItemController HoC; scrolling your component to the
top of the scroller.

If some children are expanded and some collapsed then it will expand them all.


##### areAllItemsExpanded : PropTypes.bool

A boolean telling your component if all the child collapserItems are expanded.
Use this to display information to the user about whether it will expand it children or close them the next time expandCollapseAll is called.

If areAllItemsExpanded is true, then the next call will collapse all expand children -otherwise it will expand all children.
