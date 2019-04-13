import React from 'react';
import styles from './App.scss';

import Scroller from '../../../src';

import CommentThread from '../CommentThread';
import SimpleCollapser from '../SimpleCollapser';

const App = () => (
  <div className={styles.main}>
    <h2>react-scroll-collapse - Examples</h2>
    <div className={styles.codelink}>
      <a href="https://github.com/danhaggard/react-scroll-collapse">View code on Github</a>
    </div>
    <div className={styles.example}>
      <h3>Simple Example</h3>
      <p>
        Click the headings in the scrolling containers to collapse multiple
        or single items.
        Delete or add an item - the wrappers will track the collapse/scroll
        state of the new items.
      </p>
      <Scroller style={{ height: '300px' }}>
        <SimpleCollapser />
        <SimpleCollapser />
      </Scroller>
    </div>
    <div className={styles.example}>
      <h3>Nested Example</h3>
      <p>
        You can nest elements wrapped with the collapserController wrapper.
        Adding lots of threads at the top level will increase the number of
        nested elements exponentially.  You can use this to get a feel for the
        performance costs.
      </p>
      <Scroller style={{ height: '300px' }}>
        <CommentThread childThreads={2} />
      </Scroller>
    </div>
    { /* <ContextTest /> */}
  </div>
);

export default App;
