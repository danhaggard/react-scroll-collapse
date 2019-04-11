import createProvider from '../provider';

const itemProvider = createProvider(
  [],
  () => ({}),
  'items'
);

/*
import React, { Component } from 'react';
import registry from '../Registry';

const itemProvider = (Context, Comp) => {
  class ItemProvider extends Component {

    state = {
      isOpen: false,
    }

    toggleOpen = () => this.setState(prevState => ({ isOpen: !prevState }));

    render() {
      const { isOpen } = this.state;
      return <Comp isOpen={isOpen} toggleOpen={this.toggleOpen} />;
    }
  }

  return registry(Context, ItemProvider, 'items');
};
*/
export default itemProvider;
