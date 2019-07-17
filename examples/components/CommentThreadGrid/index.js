import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import CommentWithButtons from '../Comment/CommentWithButtons';
import ExpandButton from '../ExpandButton';
import AnimatedGrid from '../../../src/components/AnimatedGrid';
import { collapserController } from '../../../src';
import { ofBoolTypeOrNothing, ofChildrenType, ofNumberTypeOrNothing } from '../../../src/utils/propTypeHelpers';
import { getRandomInt } from '../../../src/utils/randomUtils';
import { mapFromNumber, insertAtIndex, loopArrayIndex, removeFromArray } from '../../../src/utils/arrayUtils';
import { generateCommentThreadData } from '../../../src/utils/randomContentGenerators';
import styles from './CommentThread.scss';


class CommentThread extends PureComponent {

  buttonStyle = { order: -5 };

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
      numColumns,
      activeColumnId,
      activeColumnWidth,
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
      activeColumnId,
      activeColumnWidth,
      numColumns,
      currNumColumns: children.length || 1,
      realNumColumns: children.length || 1,
    };
  }

  getNumColumns = (modifier = 0) => {
    let numColSource;
    if (this.state) {
      numColSource = this.state;
    } else {
      numColSource = this.props;
    }
    const { currNumColumns } = numColSource;
    const { columnId, parentActiveColumnId, children } = this.props;
    const finalChildren = this.state ? this.state.localChildren : children;
    const numChildren = finalChildren.length;
    const finalNumChildren = numChildren + modifier;

    // const { _reactScrollCollapse: { id: collapserId } } = this.props;
    // console.log(`this.getNumColumns - collapserId: ${collapserId}, columnId: ${this.props.columnId}, parentActiveColumnId: ${parentActiveColumnId}`);

    if (parentActiveColumnId !== null && parentActiveColumnId !== columnId) {
      return 1;
    }
    if (finalNumChildren <= currNumColumns) {
      return finalNumChildren;
    }
    return currNumColumns;
  }

  getColumnWidth = (numColumns, activeColumnId, activeColumnWidth) => (colIndex) => {
    const { parentActiveColumnId, columnId } = this.props;

    const maxWidth = 100;
    const remainingWidth = activeColumnId === null ? maxWidth : maxWidth - activeColumnWidth;
    if (parentActiveColumnId !== null && parentActiveColumnId !== columnId) {
      return maxWidth / 100;
    }
    if (colIndex === activeColumnId) {
      return activeColumnWidth / 100;
    }
    const divisor = activeColumnId === null ? numColumns : numColumns - 1;

    if (activeColumnId >= divisor + 1) {
      return maxWidth / (divisor + 1) / 100;
    }

    /*
      i.e. if the current active column just got removed.
    */
    if (divisor === 0) {
      return maxWidth / numColumns / 100;
    }
    return remainingWidth / divisor / 100;
  }

  getColumnId = (childIndex) => {
    const { currNumColumns } = this.state;
    if (childIndex < currNumColumns) {
      return childIndex;
    }
    return childIndex - currNumColumns;
  }

  getColumnGap = () => {
    const { numColumns, currNumColumns } = this.state;
    if (currNumColumns < numColumns) {
      return 0;
    }
    return 2.5;
  }

  getChildMargins = (childIndex) => {
    const { numColumns, currNumColumns } = this.state;
    let leftMargin = 0;
    let rightMargin = 0;
    const columnId = this.getColumnId(childIndex);

    if (columnId === 0) {
      leftMargin = 1;
    }
    if (columnId === currNumColumns - 1) {
      rightMargin = 1;
    }

    if (currNumColumns === numColumns) {
      return [leftMargin, rightMargin];
    }
    if (columnId !== 0) {
      leftMargin = 2.5;
    }
    return [leftMargin, rightMargin];
  }

  getChildGridRowStartEnd = (childIndex) => {
    const { parentActiveColumnId, columnId } = this.props;
    const { numColumns } = this.state;

    if (parentActiveColumnId !== null && parentActiveColumnId !== columnId) {
      return {
        gridRowStart: childIndex + 2,
        gridRowEnd: childIndex + 3,
        gridColumnStart: 1,
        gridColumnEnd: numColumns + 1,
      };
    }
    return {};
  }

  getNumRows = () => {
    const { localChildren, currNumColumns } = this.state;
    const numChildren = localChildren.length;
    if (currNumColumns === 0) {
      return 2;
    }

    // const { _reactScrollCollapse: { id: collapserId } } = this.props;
    // console.log(`this.getNumRows - collapserId: ${collapserId}, columnId: ${this.props.columnId}, numRows: ${Math.ceil(numChildren / numColumns) + 1}`);
    // console.log('float, math.ceil, parseInt', numChildren / currNumColumns, Math.ceil(numChildren / currNumColumns), parseInt(numChildren / currNumColumns, 10))
    const float = numChildren / currNumColumns;
    let int = parseInt(numChildren / currNumColumns, 10);
    if (int < float) {
      int += 1;
    }
    return int;
    // return Math.ceil(numChildren / currNumColumns) + 1;
  }

  getGridTemplateRows = () => mapFromNumber(this.getNumRows(), () => 'auto').join(' ');

  getCommentStyle = () => {
    const { numColumns } = this.state;
    return {
      gridColumnStart: 1,
      gridColumnEnd: numColumns + 1,
    };
  }

  setNumColumns = (numColumnsArg) => {
    const maxNumColumns = this.props.numColumns;

    this.setState(({ currNumColumns, realNumColumns }) => {
      let numColumns = numColumnsArg + currNumColumns;
      let newRealNumColumns = numColumnsArg + realNumColumns;
      newRealNumColumns = (newRealNumColumns < 2 && numColumnsArg > 0) ? 2 : newRealNumColumns;
      numColumns = newRealNumColumns <= maxNumColumns + 1 ? newRealNumColumns - 1 : maxNumColumns;
      numColumns = numColumns === 0 ? 1 : numColumns;
      return {
        currNumColumns: numColumns,
        realNumColumns: newRealNumColumns,
      };
    });
  }

  setActiveColumnId = activeColumnId => this.setState({ activeColumnId });

  setActiveColumnWidth = activeColumnWidth => this.setState({ activeColumnWidth });

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
    this.setNumColumns(numNewChildren);
  };

  removeThread = () => {
    this.setState(this.removeChild);
    this.setNumColumns(-1);
  }

  toggleControls = () => this.setState(
    ({ showControls }) => ({ showControls: !showControls })
  );

  /* -------------------END - Child Management - END --------------------- */


  /* ------------------- Style / Content - Management --------------------- */

  appendTitle = (id, title) => ` Collapser ${id.toString()} -- ${title || 'row: 0 - node: 0'}`;

  getClassName = ({ isActiveSibling, children, areAllItemsExpanded }) => cx(
    styles.commentThread, {
      [styles.expanded]: isActiveSibling,
      [styles.noChildren]: (children.length === 0 && !areAllItemsExpanded)
        || (children.length > 0 && areAllItemsExpanded),
    }
  );

  getFlexBasis = ({ isActiveSibling, noActiveSiblings }) => {
    if (isActiveSibling) {
      return 0.65;
    }
    if (noActiveSiblings) {
      return 0.87;
    }
    return 0.15;
  }

  getBackgroundRotation = ({ isActiveSibling, noActiveSiblings, areAllItemsExpanded }) => {
    if (areAllItemsExpanded && isActiveSibling) {
      return 45 + (this.state.depth * 180);
    }
    if (areAllItemsExpanded && noActiveSiblings) {
      return 45 + (this.state.depth * 180);
    }
    if (areAllItemsExpanded && !isActiveSibling) {
      return 225 + (this.state.depth * 180);
    }
    return 225 + (this.state.depth * 180);
  }

  /* ------------------- END - Style / Content - Management - END --------------------- */


  /* ------------------- Event Handlers --------------------- */

  handleOnClick = (callExpandCollapseAll = true) => () => {
    const {
      columnId,
      parentActiveColumnId,
      parentHandleOnClick,
      setActiveColumnId,
      expandCollapseAll,
      areAllItemsExpanded
    } = this.props;

    if (columnId !== parentActiveColumnId && !areAllItemsExpanded) {
      setActiveColumnId(columnId);
      parentHandleOnClick();
    }

    if (columnId === parentActiveColumnId && areAllItemsExpanded) {
      setActiveColumnId(null);
    }

    if (areAllItemsExpanded) {
      this.setActiveColumnId(null);
    }

    if (callExpandCollapseAll) {
      expandCollapseAll();
    }

    if (columnId === parentActiveColumnId) {
      parentHandleOnClick();
    }
  };

  handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.props.expandCollapseAll();
    }
  }

  /* ------------------- END - Event Handlers - END --------------------- */


  /* to prevent renders from recreating the style obj everytime */
  // styleObj = { ...this.props.style, zIndex: `${0 - this.state.branch}` };

  render() {
    const {
      setActiveChildLimit,
      areAllItemsExpanded,
      children,
      childIsOpenedInit,
      collapserRef,
      _reactScrollCollapse: { id: collapserId, isRootNode },
      isOpenedInit,
      style,
      columnId,
      margins,
      activeChildren,
      setActiveColumnId,
      parentActiveColumnId,
    } = this.props;
    const {
      // branch,
      childInsertionIndex,
      minChildren,
      minDepth,
      maxChildren,
      maxDepth,
      comment,
      localChildren,
      showControls,
      title,
      activeColumnId,
      activeColumnWidth,
      columns,
      childIndex,
      columnsOnMount,
      currNumColumns,
      numColumns,
    } = this.state;
    // console.log(`id: ${collapserId}, activeChildren: ${activeChildren}`);
    // console.log(`id: ${collapserId}, activeColumnId: ${activeColumnId} columns: ${columns}`);
    // console.log('');
    // console.log(`id: ${collapserId}, activeChildren: ${activeChildren}`);
    const columnsOnMountVals = mapFromNumber(numColumns, this.getColumnWidth(
      numColumns, activeColumnId, activeColumnWidth
    ));
    if (collapserId === 4) {
      debugger;
    }
    const gridColumnWidths = mapFromNumber(currNumColumns, this.getColumnWidth(
      currNumColumns, activeColumnId, activeColumnWidth
    ));

    if (collapserId === 4) {
      console.log(`this.render - collapserId: ${collapserId}, columnId: ${columnId}, parentActiveColumnId: ${parentActiveColumnId}`, this.props);
      console.log(`this.render - currNumColumns: ${currNumColumns}, gridColumnWidths: ${gridColumnWidths}, columnsOnMountVals: ${columnsOnMountVals}`);
      console.log('');
      console.log('');
    }

    return (
      <AnimatedGrid
        className={this.getClassName(this.props)}
        id={collapserId}
        // flexBasis={this.getFlexBasis(this.props)}
        // backgroundRotation={this.getBackgroundRotation(this.props)}
        isRootNode={isRootNode}
        onClick={this.handleOnClick()}
        onKeyDown={this.handleKeyDown}
        ref={collapserRef}
        style={{
          ...style,
          gridTemplateRows: this.getGridTemplateRows(),
        }}
        gridColumnWidths={gridColumnWidths}
        gridColumnGap={this.getColumnGap()}
        margins={margins}
        columnsOnMount={columnsOnMountVals}
      >
        <div className={styles.comment} style={this.getCommentStyle()}>
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
          />
        </div>
        { /* children.length > 0 && children */ }
        {
          localChildren.length > 0 && localChildren.map((childNodeData, index) => (
            <WrappedCommentThread
              columnId={this.getColumnId(index)}
              childIndex={index}
              margins={this.getChildMargins(index)}
              parentColumnId={columnId}
              setActiveColumnId={this.setActiveColumnId}
              setParentActiveColumnId={setActiveColumnId}
              parentActiveColumnId={activeColumnId}
              parentHandleOnClick={this.handleOnClick(false)}
              setActiveChildLimit={setActiveChildLimit}
              isOpenedInit={childIsOpenedInit}
              childIsOpenedInit={childIsOpenedInit}
              key={childNodeData.key}
              nodeData={childNodeData}
              childInsertionIndex={childInsertionIndex}
              style={{
                ...this.getChildGridRowStartEnd(index)
              }}
              {...{
                minChildren,
                minDepth,
                maxChildren,
                maxDepth,
              }}
            />
          ))
        }
      </AnimatedGrid>
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
  setActiveChildLimit: 0,
  style: {},

  columnId: 0,
  childIndex: 0,
  margins: [0, 0],
  numColumns: 4,
  activeColumnId: null,
  activeColumnWidth: 70,
  parentActiveColumnId: 0,
  parentColumnId: 0,
  parentHandleOnClick: () => null,
  setActiveColumnId: () => null,
  setParentActiveColumnId: () => null,
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

  childIndex: PropTypes.number,
  columnId: PropTypes.number,
  margins: PropTypes.array,
  numColumns: PropTypes.number,
  activeColumnId: PropTypes.number,
  activeColumnWidth: PropTypes.number,
  parentActiveColumnId: PropTypes.number,
  parentColumnId: PropTypes.number,
  parentHandleOnClick: PropTypes.func,
  setActiveColumnId: PropTypes.func,
  setParentActiveColumnId: PropTypes.func,
};

CommentThread.whyDidYouRender = {
  logOnDifferentValues: false,
  customName: 'CommentThreadPerf'
};

const WrappedCommentThread = collapserController(CommentThread);

export default WrappedCommentThread;
