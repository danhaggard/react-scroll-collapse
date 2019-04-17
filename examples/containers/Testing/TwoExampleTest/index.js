import React from 'react';
import styles from './App.scss';

import Scroller from '../../../../src';

import SimpleCollapserFixed from '../../../components/SimpleCollapserFixed';
import CommentThread from '../../../components/CommentThreadFixed';
import Example from '../../../components/Example';

const EXAMPLE_COPY = {
  0: {
    title: 'Simple Example',
    text: `Click the headings in the scrolling containers to collapse multiple or
    single items. Delete or add an item - the wrappers will track the collapse/scroll
    state of the new items.`
  },
  1: {
    title: 'Nested Example',
    text: `You can nest elements wrapped with the collapserController wrapper.
    Adding lots of threads at the top level will increase the number of
    nested elements exponentially.  You can use this to get a feel for the
    performance costs.`
  }
};

const scrollerStyle = { height: '100%' };

const App = () => (
  <div className={styles.main}>
    <header className={styles.header}>
      <h1 className={styles.pageTitle}>react-scroll-collapse - Examples</h1>
      <div className={styles.codelink}>
        <a href="https://github.com/danhaggard/react-scroll-collapse">View code on Github</a>
      </div>
    </header>
    <div className={styles.container}>
      <Example {...EXAMPLE_COPY[0]}>
        <div className={styles.scrollerWrapper}>
          <Scroller style={scrollerStyle}>
            <SimpleCollapserFixed initialComments={10} />
            <SimpleCollapserFixed initialComments={10} />
          </Scroller>
        </div>
      </Example>
      <Example {...EXAMPLE_COPY[1]}>
        <div className={styles.scrollerWrapper}>
          <Scroller style={scrollerStyle}>
            <CommentThread childThreads={3} />
          </Scroller>
        </div>
      </Example>
    </div>
  </div>
);

export default App;
