import React from 'react';
import ExpandButton from '../ExpandButton';
import { collapserProvider, collapserItemProvider } from '../../../src';

const mapCollapserProps = ({
  areAllItemsExpanded,
  collapserRef,
  expandCollapseAll,
  ...rest
}) => ({
  isOpened: areAllItemsExpanded,
  forwardRef: collapserRef,
  onClick: expandCollapseAll,
  ...rest
});

const mapCollapserItemProps = ({
  collapserItemRef,
  expandCollapse,
  ...rest
}) => ({
  forwardRef: collapserItemRef,
  onClick: expandCollapse,
  ...rest
});

const wrapComponent = (
  mapProps,
  provider,
  Component
) => provider(props => <Component ref={mapProps(props).forwardRef} {...mapProps(props)} />);

export const CollapserExpandButton = wrapComponent(
  mapCollapserProps,
  collapserProvider,
  ExpandButton
);

export const CollapserItemExpandButton = wrapComponent(
  mapCollapserItemProps,
  collapserItemProvider,
  ExpandButton
);
