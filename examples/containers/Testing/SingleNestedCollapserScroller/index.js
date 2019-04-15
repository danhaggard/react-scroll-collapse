import React from 'react';
import styles from './App.scss';

import Scroller from '../../../../src';

import CommentThread from '../../../components/CommentThreadFixed';

const scrollerStyle = { height: '100%' };

const App = () => (
  <div className={styles.main}>
    <header className={styles.header}>
      <h2>react-scroll-collapse - Examples</h2>
      <div className={styles.codelink}>
        <a href="https://github.com/danhaggard/react-scroll-collapse">View code on Github</a>
      </div>
    </header>
    <div className={styles.container}>
      <div className={styles.example}>
        <div className={styles.exampleHeader}>
          <h3>Nested Example</h3>
          <p>
            You can nest elements wrapped with the collapserController wrapper.
            Adding lots of threads at the top level will increase the number of
            nested elements exponentially.  You can use this to get a feel for the
            performance costs.
          </p>
        </div>
        <div className={styles.scrollerWrapper}>
          <Scroller style={scrollerStyle}>
            <CommentThread childThreads={1} />
          </Scroller>
        </div>
      </div>
    </div>
  </div>
);

export default App;
