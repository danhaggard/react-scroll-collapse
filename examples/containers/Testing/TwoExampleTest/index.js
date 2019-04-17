import React from 'react';
import styles from './App.scss';

import Scroller from '../../../../src';
import SimpleCollapserFixed from '../../../components/SimpleCollapser';
import CommentThread from '../../../components/CommentThread';
import Example from '../../../components/Example';
import PageHeader from '../../../components/PageHeader';

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

const App = () => (
  <div className={styles.main}>
    <PageHeader />
    <div className={`${styles.container} two-column-layout`}>
      <Example {...EXAMPLE_COPY[0]}>
        <Scroller className={styles.scroller}>
          <SimpleCollapserFixed initialComments={10} />
          <SimpleCollapserFixed initialComments={10} />
        </Scroller>
      </Example>
      <Example {...EXAMPLE_COPY[1]}>
        <Scroller className={styles.scroller}>
          <CommentThread childThreads={3} />
        </Scroller>
      </Example>
    </div>
  </div>
);

export default App;
