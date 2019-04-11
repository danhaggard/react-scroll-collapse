import React from 'react';
import styles from './App.scss';

import scrollerProvider from '../../../src/wrappers/scroller/scrollerProvider';

// const Span = ({ val }) => <span>{val}</span>;
const Logger = props => (
  <div>
    <ul>
      {
        Object.keys(props).forEach(key => (
          <li>
            { key }
            :
            { props[key] }
          </li>
        ))
      }
    </ul>
  </div>
);

const Context = React.createContext({ parentScrollerId: 11 });
const ScrollerLogger = scrollerProvider(Context, Logger);

// import Scroller from '../../../src';


const App = () => (
  <div className={styles.main}>
    <h2>Scroller Logger Test</h2>
    <ScrollerLogger blah="blah man" />
  </div>
);

export default App;
