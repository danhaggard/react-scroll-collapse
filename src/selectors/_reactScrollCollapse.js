// eslint-disable-next-line
export const getScrollerRootNode = (props) => {
  return (
    props
    && props._reactScrollCollapse
    && props._reactScrollCollapse.rootNodes
    && props._reactScrollCollapse.rootNodes.scroller) || null;
};
