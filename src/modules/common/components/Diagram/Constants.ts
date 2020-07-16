export const Event: { [key: string]: string } = {
  AddLinkClicked: 'addLinkClicked',
  SelectionChanged: 'selectionChanged',
  ClickNode: 'clickNode',
  ColorChanged: 'colorChanged',
  WidthChanged: 'widthChanged',
  RemoveNode: 'removeNode',
  NodesUpdated: 'nodesUpdated',
  LinksUpdated: 'linksUpdated',
  OffsetUpdated: 'offsetUpdated',
  ZoomUpdated: 'zoomUpdated',
  GridUpdated: 'gridUpdated',
  EntityRemoved: 'entityRemoved',
  AddParallelNode: 'addParallelNode',
  SourcePortChanged: 'sourcePortChanged',
  TargetPortChanged: 'targetPortChanged'
}

export const DiagramType: { [key: string]: string } = {
  Default: 'default',
  EmptyNode: 'empty-node',
  CreateNew: 'create-new',
  DiamondNode: 'default-diamond',
  StartNode: 'node-start'
}
