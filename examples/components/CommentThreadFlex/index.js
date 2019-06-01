import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import CommentWithButtons from '../Comment/CommentWithButtons';
import ExpandButton from '../ExpandButton';
import AnimatedFlexbox from '../../../src/components/AnimatedFlexbox';
import { collapserController } from '../../../src';
import { ofBoolTypeOrNothing, ofChildrenType, ofNumberTypeOrNothing } from '../../../src/utils/propTypeHelpers';
import { getRandomInt } from '../../../src/utils/randomUtils';
import { insertArrayAtIndex } from '../../../src/utils/arrayUtils';
import { generateCommentThreadData } from '../../../src/utils/randomContentGenerators';
import styles from './CommentThread.scss';


class CommentThread extends PureComponent { //eslint-disable-line

  buttonStyle = { order: -5 };

  state = (() => {
    const {
      branch,
      children,
      comment,
      count,
      isOpenedInit,
      depth,
      title
    } = this.props.nodeData;
    return {
      branch,
      comment,
      count,
      depth,
      title,
      localChildren: children,
      threadActive: isOpenedInit || false,
    };
  })();

  removeChild = state => ({
    ...state,
    localChildren: state.localChildren.slice(0, -1),
  });

  insertThread = () => {
    const { minChildren, maxChildren, insertChildAtIndex } = this.props;
    const { count, depth } = this.state;
    const numNewChildren = getRandomInt(minChildren, maxChildren) - 1;
    const newChildren = [...Array(numNewChildren).keys()].map(
      i => this.generateChildData(count + i, depth + 1)
    );
    this.setState(this.addChildren(newChildren, insertChildAtIndex));
  };

  removeThread = () => this.setState(this.removeChild);

  addChildren = (children, insertChildAtIndex = null) => state => ({
    ...state,
    count: state.count + children.length,
    localChildren: insertArrayAtIndex(state.localChildren, children, insertChildAtIndex),
    // localChildren: [...state.localChildren, ...children],
  });

  generateChildData = (count, depth) => generateCommentThreadData(
    this.props,
    count,
    depth,
  );

  appendTitle = (id, title) => ` Collapser ${id.toString()} -- ${title || 'row: 0 - node: 0'}`;

  getClassName = ({ isActiveSibling, children, areAllItemsExpanded }) => cx(
    styles.commentThread, {
      [styles.expanded]: isActiveSibling,
      [styles.noChildren]: (children.length === 0 && !areAllItemsExpanded) || (children.length > 0 && areAllItemsExpanded),
    }
  );

  getFlexBasis = ({ isActiveSibling, noActiveSiblings }) => {
    if (isActiveSibling) {
      return 0.70;
    }
    if (noActiveSiblings) {
      return 0.25;
    }
    return 0.15;
  }

  handleOnClick = (e) => {
    this.props.expandCollapseAll();
  };

  /* to prevent renders from recreating the style obj everytime */
  // styleObj = { ...this.props.style, zIndex: `${0 - this.state.branch}` };

  render() {
    const {
      setActiveChildLimit,
      areAllItemsExpanded,
      children,
      childIsOpenedInit,
      expandCollapseAll,
      collapserRef,
      _reactScrollCollapse: { id: collapserId, isRootNode },
      minChildren,
      minDepth,
      maxChildren,
      maxDepth,
      isOpenedInit,
      parentOnClick,
      style,
    } = this.props;
    const {
      branch,
      comment,
      localChildren,
      title
    } = this.state;
    // console.log('thread render: id', collapserId);
    return (
      <AnimatedFlexbox
        className={this.getClassName(this.props)}
        id={collapserId}
        flexBasis={this.getFlexBasis(this.props)}
        isRootNode={isRootNode}
        onClick={this.handleOnClick}
        ref={collapserRef}
        style={style}
      >
        <ExpandButton
          isOpened={areAllItemsExpanded}
          // onClick={expandCollapseAll}
          style={this.buttonStyle}
          title={this.appendTitle(collapserId, title)}
        />
        <CommentWithButtons
          isOpenedInit={isOpenedInit}
          addToThread={this.insertThread}
          childThreads={localChildren.length}
          deleteThread={this.removeThread}
          text={comment}
        />
        { children.length > 0 && children }
        {
          localChildren.length > 0 && localChildren.map(childNodeData => (
            <WrappedCommentThread
              setActiveChildLimit={setActiveChildLimit}
              isOpenedInit={childIsOpenedInit}
              childIsOpenedInit={childIsOpenedInit}
              key={childNodeData.key}
              nodeData={childNodeData}
              {...{
                minChildren: minChildren - 1,
                minDepth,
                maxChildren: maxChildren - 1,
                maxDepth,
              }}
            />
          ))
        }
      </AnimatedFlexbox>
    );
  }
}

CommentThread.defaultProps = {
  areAllItemsExpanded: null,
  children: [],
  getParentThreadActive: () => false,
  insertChildAtIndex: null,
  maxChildren: 1,
  maxDepth: 1,
  minChildren: 1,
  minDepth: 1,
  style: {},
};

CommentThread.propTypes = {
  areAllItemsExpanded: ofBoolTypeOrNothing,
  children: ofChildrenType,
  // collapserId: PropTypes.number.isRequired,
  collapserRef: PropTypes.object.isRequired,
  expandCollapseAll: PropTypes.func.isRequired,
  getParentThreadActive: PropTypes.func,
  insertChildAtIndex: ofNumberTypeOrNothing,
  nodeData: PropTypes.object.isRequired,
  maxChildren: PropTypes.number,
  maxDepth: PropTypes.number,
  minChildren: PropTypes.number,
  minDepth: PropTypes.number,
  style: PropTypes.object,
};

CommentThread.whyDidYouRender = {
  logOnDifferentValues: false,
  customName: 'CommentThreadPerf'
};

const WrappedCommentThread = collapserController(CommentThread);

export default WrappedCommentThread;
