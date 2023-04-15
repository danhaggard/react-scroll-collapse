import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import CommentWithButtons from '../Comment/CommentWithButtons';
import ExpandButton from '../ExpandButton';
import AnimatedFlexbox from '../../../src/components/AnimatedFlexbox';
import { collapserController } from '../../../src';
import { ofBoolTypeOrNothing, ofChildrenType, ofNumberTypeOrNothing } from '../../../src/utils/propTypeHelpers';
import { getRandomInt } from '../../../src/utils/randomUtils';
import {
  insertAtIndex,
  loopArrayIndex,
  removeFromArray,
  mapFromNumber,
  wrapXaroundY,
} from '../../../src/utils/arrayUtils';
import { generateCommentThreadData } from '../../../src/utils/randomContentGenerators';
import styles from './CommentThread.scss';


class CommentThread extends PureComponent {

  buttonStyle = { order: -2 };

  commentStyle = { order: -1 };

  totalAddedChildren = 0;

  constructor(props, context) {
    super(props, context);
    const {
      childInsertionIndex,
      nodeData: { children, ...rest },
      minChildren,
      minDepth,
      maxChildren,
      maxDepth,
    } = this.props;
    this.state = {
      ...rest,
      localChildren: children,
      childInsertionIndex,
      minChildren,
      minDepth,
      maxChildren,
      maxDepth,
      showControls: false,
      flexOrder: mapFromNumber(children.length, () => ({ position: 'relative' })),

      transposeStyle: {
        left: 0,
      },
      transposing: false,
      childTranspositionCount: 0,
    };
  }

  getChildStyle = () => {
    const newStyle = {
      position: 'relative',
    };
    return newStyle;
  }

  /* ------------------- Child Management --------------------- */
  generateChildData = (count, depth) => generateCommentThreadData(
    this.props,
    count,
    depth,
  );

  setChildInsertionConfig = ({ childInsertionIndex, ...rest }) => this.setState(
    ({ localChildren }) => ({
      childInsertionIndex: loopArrayIndex(localChildren, childInsertionIndex),
      ...rest,
    })
  );


  setChildInsertionIndex = val => this.setState(
    ({ localChildren }) => ({ childInsertionIndex: loopArrayIndex(localChildren, val) })
  );

  addChildren = (children, childInsertionIndex = null) => state => ({
    ...state,
    count: state.count + children.length,
    localChildren: insertAtIndex(state.localChildren, children, childInsertionIndex),
  });

  removeChild = ({ localChildren, childInsertionIndex }) => ({
    localChildren: removeFromArray(localChildren, childInsertionIndex),
  });

  insertThread = () => {
    const { count, depth, childInsertionIndex, minChildren, maxChildren } = this.state;
    const numNewChildren = getRandomInt(minChildren, maxChildren);
    const newChildren = [...Array(numNewChildren).keys()].map(
      i => generateCommentThreadData(this.state, count + i, depth + 1)
    );
    this.setState(this.addChildren(newChildren, childInsertionIndex));
  };

  removeThread = () => this.setState(this.removeChild);

  toggleControls = () => this.setState(
    ({ showControls }) => ({ showControls: !showControls })
  );

  /* -------------------END - Child Management - END --------------------- */


  /* ------------------- Style / Content - Management --------------------- */

  appendTitle = (id, title) => ` Collapser ${id.toString()} -- ${title || 'row: 0 - node: 0'}`;

  getClassName = ({ isActiveSibling }) => cx(
    styles.commentThread, {
      [styles.expanded]: isActiveSibling,
    }
  );

  getFlexBasis = ({ isActiveSibling, noActiveSiblings }) => {
    const { depth } = this.state;
    if (isActiveSibling) {
      return 0.55;
    }
    if (noActiveSiblings && depth < 4) {
      return 0.25;
    }
    if (noActiveSiblings && depth >= 4) {
      return 0.65;
    }
    if (depth >= 3) {
      return 0;
    }
    return 0.15;
  }

  getBackgroundRotation = () => {
    const { depth } = this.state;
    const direction = 1;
    return direction * (135 + (depth * 180));
  }

  setTransposeStyle = (directionMultiple, base = 0.3333) => {
    const { childTranspositionCount, flexOrder, transposeStyle } = this.state;
    const { length } = flexOrder;
    const wrappedTranspositionCount = wrapXaroundY(
      childTranspositionCount + directionMultiple, length
    );
    const baseMultiple = base * wrappedTranspositionCount;
    if (transposeStyle.left !== baseMultiple) {
      this.setState(() => ({
        childTranspositionCount: wrappedTranspositionCount,
        transposeStyle: { left: baseMultiple },
        transposing: true,
      }));
    }
  }

  /* ------------------- END - Style / Content - Management - END --------------------- */

  getFlexWrapper = children => (
    <div className={styles.wrapper}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        width: `${this.getFlexBasis(this.props)}%`
      }}>
        { children }
      </div>
    </div>
  );


  renderTransposedChildren = (children) => {
    try {
      React.Children.only(children);
      return children;
    } catch {
      const childArray = React.Children.toArray(children);
      const insertArray = childArray.slice(2, childArray.length);
      const insertArrayLength = insertArray.length;
      const headArray = childArray.slice(0, 2);
      let cloneA;
      let cloneB;
      if (insertArrayLength > 0) {
        cloneA = [{ ...insertArray[0], key: `${insertArray[0].key}-copy` }];
        cloneB = [{ ...insertArray[insertArrayLength - 1], key: `${insertArray[insertArrayLength - 1].key}-copy` }];
      } else {
        cloneA = [];
        cloneB = [];
      }
      const finalArray = [...headArray, this.getFlexWrapper([...cloneA, ...insertArray, ...cloneB])];
      return finalArray;
    }
  }


  /* ------------------- Event Handlers --------------------- */

  handlePointerDownTimeout = () => {
    this.props.expandCollapseAll();
    if (this.pointerDownTimeoutId) {
      clearTimeout(this.pointerDownTimeoutId);
      this.pointerDownTimeoutId = null;
    }
  }

  handleOnPointerDown = () => {
    this.props.expandCollapseAll();
  }

  handleOnPointerUp = () => {}

  handleOnClick = () => {};

  handleOnDoubleClick = () => {};

  handleShiftOrder = (keyCode) => {
    let direction = 0;
    if (keyCode === 39) {
      direction = 1;
    }

    if (keyCode === 37) {
      direction = -1;
    }
    if (direction !== 0) {
      this.setTransposeStyle(direction);
    }
  }

  handleKeyDown = (e) => {
    const { keyCode } = e;
    this.handleShiftOrder(keyCode);
    if (keyCode === 13) {
      this.handleOnPointerDown();
    }
  }

  handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      this.handleOnPointerUp();
    }
  }

  /* ------------------- END - Event Handlers - END --------------------- */

  render() {
    const {
      setActiveChildLimit,
      areAllItemsExpanded,
      childIsOpenedInit,
      collapserRef,
      _reactScrollCollapse: { id: collapserId, isRootNode },
      isOpenedInit,
      style,
      transposeLeft,
    } = this.props;
    const {
      childInsertionIndex,
      minChildren,
      minDepth,
      maxChildren,
      maxDepth,
      comment,
      localChildren,
      showControls,
      title,
      transposeStyle: { left: transposeLeftState },
    } = this.state;
    const newStyle = { ...style };
    if (collapserId === 0) {
      newStyle.width = '85vw';
    }
    return (
      <AnimatedFlexbox
        className={this.getClassName(this.props)}
        id={collapserId}
        flexBasis={this.getFlexBasis(this.props)}
        backgroundRotation={this.getBackgroundRotation()}
        transposeLeft={transposeLeft}
        isRootNode={isRootNode}
        onPointerDown={this.handleOnPointerDown}
        onPointerUp={this.handleOnPointerUp}
        onKeyDown={this.handleKeyDown}
        onKeyUp={this.handleKeyUp}
        ref={collapserRef}
        style={style}
      >
        <ExpandButton
          isOpened={areAllItemsExpanded}
          onHamburgerClick={this.toggleControls}
          style={this.buttonStyle}
          title={this.appendTitle(collapserId, title)}
        />
        <CommentWithButtons
          addToThread={this.insertThread}
          childInsertionIndex={childInsertionIndex}
          minChildren={minChildren}
          maxChildren={maxChildren}
          minDepth={minDepth}
          maxDepth={maxDepth}
          setChildInsertionConfig={this.setChildInsertionConfig}
          childThreads={localChildren.length}
          deleteThread={this.removeThread}
          isOpenedInit={isOpenedInit}
          showControls={showControls}
          showInsertForm={showControls}
          tabFocusButtons={areAllItemsExpanded}
          text={comment}
          style={this.commentStyle}
        />
        {
          localChildren.length > 0 && localChildren.map(childNodeData => (
            <WrappedCommentThread
              transposeLeft={transposeLeftState}
              setActiveChildLimit={setActiveChildLimit}
              isOpenedInit={childIsOpenedInit}
              childIsOpenedInit={childIsOpenedInit}
              key={childNodeData.key}
              nodeData={childNodeData}
              childInsertionIndex={childInsertionIndex}
              style={this.getChildStyle()}
              {...{
                minChildren,
                minDepth,
                maxChildren,
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
  childInsertionIndex: 0,
  isOpenedInit: true,
  childIsOpenedInit: true,
  maxChildren: 1,
  maxDepth: 1,
  minChildren: 1,
  minDepth: 1,
  setActiveChildLimit: 1,
  style: {},
  transposeLeft: 0,
};

CommentThread.propTypes = {
  areAllItemsExpanded: ofBoolTypeOrNothing,
  children: ofChildrenType,
  childIsOpenedInit: PropTypes.bool,
  collapserRef: PropTypes.object.isRequired,
  expandCollapseAll: PropTypes.func.isRequired,
  childInsertionIndex: ofNumberTypeOrNothing,
  isOpenedInit: PropTypes.bool,
  nodeData: PropTypes.object.isRequired,
  maxChildren: PropTypes.number,
  maxDepth: PropTypes.number,
  minChildren: PropTypes.number,
  minDepth: PropTypes.number,
  _reactScrollCollapse: PropTypes.object.isRequired,
  setActiveChildLimit: PropTypes.number,
  style: PropTypes.object,
  transposeLeft: PropTypes.number,
};

CommentThread.whyDidYouRender = {
  logOnDifferentValues: false,
  customName: 'CommentThreadPerf'
};

const WrappedCommentThread = collapserController(CommentThread);

WrappedCommentThread.defaultProps = {
  susbcribeToExpandAll: true,
};

export default WrappedCommentThread;
