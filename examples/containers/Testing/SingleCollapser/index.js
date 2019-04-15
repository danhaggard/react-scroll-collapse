import React from 'react';
import styles from './App.scss';

import SimpleCollapserFixed from '../../../components/SimpleCollapserFixed';

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
          <h3>Performance Test One - Single Collapser</h3>
          <p>
            A single collapser - not embedded within a Scroller component.
            Use to test performance and find bad renders.
          </p>
        </div>
        <SimpleCollapserFixed />
      </div>
    </div>
  </div>
);

export default App;
