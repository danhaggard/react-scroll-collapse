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


class CommentThread extends PureComponent {

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

  getClassName = ({ isActiveSibling, noActiveSiblings }) => cx(
    styles.commentThread, {
      [styles.expanded]: isActiveSibling,
      [styles.noActive]: noActiveSiblings,
    }
  );


  getFlexBasis = ({ isActiveSibling, noActiveSiblings }) => {
    if (isActiveSibling) {
      return 0.75;
    }
    if (noActiveSiblings) {
      return 0.3;
    }
    return 0.15;
  }

  handleOnClick = () => setTimeout(this.props.expandCollapseAll, 0);

  render() {
    const {
      activeChildLimit,
      areAllItemsExpanded,
      children,
      childIsOpenedInit,
      expandCollapseAll,
      collapserRef,
      collapserId,
      minChildren,
      minDepth,
      maxChildren,
      maxDepth,
      isOpenedInit,
      isRootNode,
      style,
    } = this.props;
    const {
      branch,
      comment,
      localChildren,
      title
    } = this.state;

    return (
      <AnimatedFlexbox
        className={this.getClassName(this.props)}
        flexBasis={this.getFlexBasis(this.props)}
        ref={collapserRef}
        style={{ ...style, zIndex: `${0 - branch}` }}
      >
        <ExpandButton
          isOpened={areAllItemsExpanded}
          onClick={this.handleOnClick}
          style={{ order: -5 }}
          title={this.appendTitle(collapserId, title)}
        />
        <CommentWithButtons
          isOpenedInit={isOpenedInit}
          addToThread={this.insertThread}
          childThreads={localChildren.length}
          deleteThread={this.removeThread}
          text={comment}
        />
        { children }
        {
          localChildren.map(childNodeData => (
            <WrappedCommentThread
              activeChildLimit={activeChildLimit}
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
  collapserId: PropTypes.number.isRequired,
  collapserRef: PropTypes.object.isRequired,
  expandCollapseAll: PropTypes.func.isRequired,
  getParentThreadActive: PropTypes.func,
  insertChildAtIndex: ofNumberTypeOrNothing,
  isRootNode: PropTypes.bool.isRequired,
  nodeData: PropTypes.object.isRequired,
  maxChildren: PropTypes.number,
  maxDepth: PropTypes.number,
  minChildren: PropTypes.number,
  minDepth: PropTypes.number,
  style: PropTypes.object,
};

CommentThread.whyDidYouRender = {
  logOnDifferentValues: true,
  customName: 'CommentThreadPerf'
};

const WrappedCommentThread = collapserController(CommentThread);

export default WrappedCommentThread;
