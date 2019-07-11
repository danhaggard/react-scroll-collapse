import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './CommentThread.scss';

import CommentWithButtons from '../Comment/CommentWithButtons';
import ExpandButton from '../ExpandButton';
import { collapserController } from '../../../src';

import { getRandomTextWithDefaults } from '../../../src/utils/randomUtils';
import { ofBoolTypeOrNothing } from '../../../src/utils/propTypeHelpers';


const getNested = (noOfChildThreads, isOpenedInit) => (
  noOfChildThreads === 0 ? null
    : [...Array(noOfChildThreads).keys()].map(
      key => (
        <WrappedCommentThread
          key={key}
          childThreads={noOfChildThreads - 1}
          childIsOpenedInit={isOpenedInit}
          isOpenedInit={isOpenedInit}
        />
      )
    ));

class CommentThread extends PureComponent {

  randText = getRandomTextWithDefaults();

  state = {
    childThreads: this.props.childThreads, // eslint-disable-line react/destructuring-assignment
  }

  addToThread = () => {
    const { childThreads } = this.state;
    this.setState({ childThreads: childThreads + 1 });
  }

  deleteThread = () => this.setState({ childThreads: 0 });

  handleOnClick = () => {
    this.props.expandCollapseAll();
  };

  handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.props.expandCollapseAll();
    }
  }

  render() {
    const {
      _reactScrollCollapse: { id: collapserId },
      areAllItemsExpanded,
      childIsOpenedInit,
      collapserRef,
      isOpenedInit,
      style
    } = this.props;
    const { childThreads } = this.state;
    const idStr = collapserId.toString();
    const text = `${this.randText}`;
    const title = ` Collapser ${idStr}`;
    return (
      <div ref={collapserRef} className={styles.commentThread} style={style}>
        <ExpandButton
          isOpened={areAllItemsExpanded}
          onClick={this.handleOnClick}
          onKeyDown={this.handleKeyDown}
          title={title}
        />
        <CommentWithButtons
          addToThread={this.addToThread}
          childThreads={childThreads}
          deleteThread={this.deleteThread}
          isOpenedInit={isOpenedInit}
          showControls
          text={text}
        />
        {getNested(childThreads, childIsOpenedInit)}
      </div>
    );
  }
}

CommentThread.defaultProps = {
  areAllItemsExpanded: null,
  childIsOpenedInit: true,
  childThreads: 1,
  isOpenedInit: true,
  style: {},
};

CommentThread.propTypes = {
  _reactScrollCollapse: PropTypes.object.isRequired,
  areAllItemsExpanded: ofBoolTypeOrNothing,
  childIsOpenedInit: PropTypes.bool,
  childThreads: PropTypes.number,
  collapserRef: PropTypes.object.isRequired,
  expandCollapseAll: PropTypes.func.isRequired,
  isOpenedInit: PropTypes.bool,
  style: PropTypes.object,
};

const WrappedCommentThread = collapserController(CommentThread);
export default WrappedCommentThread;
