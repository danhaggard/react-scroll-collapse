# react-scroll-collapse
Component wrappers for auto-scrolling with elements using react-collapse

## DEMO

## Installation

### NPM
Coming Soon

### Imports
#### Importing the Scroller component:
'''
import Scroller from 'react-scroll-collapse';
'''

#### Importing the collapser HoCs:
'''
import {collapserController, collapserItemController} from 'react-scroll-collapse';
'''

#### Importing the reducers:
'''
import {reactScrollCollapse} from 'react-scroll-collapse';
'''

#### Importing the sagas:
'''
import {reactScrollCollapseSagas} from 'react-scroll-collapse';
'''

### Redux Integration
'''
react-scroll-collapse relies on [Redux](https://github.com/reactjs/redux) for state management.

You will need to include the 'reactScrollCollapse' reducer in your top level reducer with
the same state key.  See: /examples/reducers/index.js
'''

### redux-saga
'''
react-scroll-collapse also relies on [redux-saga](https://github.com/yelouafi/redux-saga)
You will need to include 'reactScrollCollapseSagas' in your root saga.  See: /examples/sagas/index.js
'''

## Usage
'''
react-scroll-collapse provides a scrolling container (<Scroller>) and two higher order components (collapserController, collapserControllerItem) which provide props
and callbacks to use when designing your react-collapse based components.


'''
