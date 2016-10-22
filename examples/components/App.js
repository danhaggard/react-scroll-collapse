import React from 'react';
import './app.css';

class AppComponent extends React.Component {

  render() {
    return (
      <div className="index">
        <div className="notice">
          Please edit <code>src/components/App.js</code> to get started!
        </div>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
