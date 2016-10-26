import React from 'react';
import './app.css';

import Scroller from '../../src';

import CommentThread from './CommentThread';
import SimpleCollapser from './SimpleCollapser';

class AppComponent extends React.Component {
  render() {
    return (
      <div>
        <div className="example">
          <h3>Nested Example</h3>
          <Scroller style={{height: '300px'}}>
            <CommentThread/>
          </Scroller>
        </div>
        <div className="example">
          <h3>Simple Example</h3>
          <Scroller style={{height: '300px'}}>
            <SimpleCollapser />
            <SimpleCollapser />
          </Scroller>
        </div>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
