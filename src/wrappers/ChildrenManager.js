import { Component } from 'react';

const childrenManager = (childStateKeys) => {

  class ChildrenManager extends Component {

    childRegisterMethods = {};

    constructor(props) {
      super(props);
      this.state = {};
      childStateKeys.forEach(key => (this.state[key] = []));
      this.createChildRegisterMethods();
    }

    addEntity = (key, id) => {
      const getNewState = (prevState) => {
        if (prevState) {
          const newState = { [key]: [...prevState[key], id] };
          return newState;
        }
        return prevState;
      };
      this.setState(getNewState);
    };

    removeEntity = (key, id) => this.setState(prevState => prevState[key].filter(
      val => val !== id
    ));

    addRemoveEntity = (key, id) => {
      const { state } = this;
      if (state[key].includes(id)) {
        return this.removeEntity(key, id);
      }
      return this.addEntity(key, id);
    }

    createRegisterMethod = key => childId => this.addRemoveEntity(key, childId);

    createChildRegisterMethods = () => {
      childStateKeys.forEach(key => (
        this.childRegisterMethods[key] = this.createRegisterMethod(key)));
    }
  }

  return ChildrenManager;

};

export default childrenManager;
