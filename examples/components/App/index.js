import React from 'react';
import styles from './App.scss';

import Scroller from '../../../src';

import CommentThread from '../CommentThread';
import SimpleCollapser from '../SimpleCollapser';

class AppComponent extends React.Component {
  render() {
    return (
      <div>
        <div className={styles.example}>
          <h3>Simple Example</h3>
          <Scroller style={{height: '300px'}}>
            <SimpleCollapser />
            <SimpleCollapser />
          </Scroller>
        </div>
        <div className={styles.example}>
          <h3>Nested Example</h3>
          <Scroller style={{height: '300px'}}>
            <CommentThread childThreads={2}/>
          </Scroller>
        </div>
      </div>
    );
  }
}

export default AppComponent;
