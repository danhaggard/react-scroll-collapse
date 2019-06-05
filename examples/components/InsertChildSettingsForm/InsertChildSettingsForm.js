import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './InsertChildSettingsForm.scss';


class InsertChildSettingsForm extends Component {

  config = {
    childInsertionIndex: this.props.childInsertionIndex,
    minChildren: this.props.minChildren,
    maxChildren: this.props.maxChildren,
    minDepth: this.props.minDepth,
    maxDepth: this.props.maxDepth,
  };

  handleChange = (e) => {
    const { setChildInsertionConfig } = this.props;
    this.config[e.target.name] = parseInt(e.target.value, 10);
    setChildInsertionConfig(this.config);
  }

  tabIndex = () => (!this.props.tabFocusButtons ? -1 : undefined)

  render() {
    const {
      childInsertionIndex,
      minChildren,
      maxChildren,
      minDepth,
      maxDepth,
    } = this.props;
    return (
      <form className={styles.settingsForm} onChange={this.handleChange}>
        <input tabIndex={this.tabIndex()} className={styles.settingsInput} defaultValue={maxChildren} name="maxChildren" placeholder="maC" type="number" />
        <input tabIndex={this.tabIndex()} className={styles.settingsInput} defaultValue={minChildren} name="minChildren" placeholder="miC" type="number" />
        <input tabIndex={this.tabIndex()} className={styles.settingsInput} defaultValue={maxDepth} name="maxDepth" placeholder="maD" type="number" />
        <input tabIndex={this.tabIndex()} className={styles.settingsInput} defaultValue={minDepth} name="minDepth" placeholder="miD" type="number" />
        <input tabIndex={this.tabIndex()} className={styles.settingsInput} defaultValue={childInsertionIndex} name="childInsertionIndex" placeholder="mCh" type="number" />
      </form>
    );
  }
}

InsertChildSettingsForm.defaultProps = {
  tabFocusButtons: true,
};

InsertChildSettingsForm.propTypes = {
  childInsertionIndex: PropTypes.number.isRequired,
  minChildren: PropTypes.number.isRequired,
  maxChildren: PropTypes.number.isRequired,
  minDepth: PropTypes.number.isRequired,
  maxDepth: PropTypes.number.isRequired,
  setChildInsertionConfig: PropTypes.func.isRequired,
  tabFocusButtons: PropTypes.bool,
};

export default InsertChildSettingsForm;
