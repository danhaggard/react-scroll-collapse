import React from 'react';
import './app.css';

import Scroller from '../../src';

import CommentThread from './CommentThread';

class AppComponent extends React.Component {

  render() {
    return (
      <div>
        <div className="index">
          <Scroller style={{height: '300px'}}>
            <CommentThread maxNest={4} />
          </Scroller>
        </div>
        <div className="index">
          <Scroller style={{height: '300px'}}>
            <CommentThread maxNest={40} />
          </Scroller>
        </div>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
