import React, { Component } from 'react';
import styles from './Main.scss';

import PageHeader from '../PageHeader';

import examples from '../../content';

class Main extends Component {
  state = {
    id: 0,
    total: Object.keys(examples).length,
  }

  next = () => {
    const { id, total } = this.state;
    const newId = id + 1 > total - 1 ? 0 : id + 1;
    this.setState({ id: newId });
  }

  prev = () => {
    const { id, total } = this.state;
    const newId = id - 1 < 0 ? total - 1 : id - 1;
    this.setState({ id: newId });
  }

  render() {
    const { id } = this.state;
    return (
      <div className={styles.main}>
        <PageHeader leftClick={this.prev} rightClick={this.next} />
        <div className={`${styles.container} two-column-layout`}>
          { examples[id] }
        </div>
      </div>
    );
  }
}

export default Main;
