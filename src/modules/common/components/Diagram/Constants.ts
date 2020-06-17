export const Event: { [key: string]: string } = {
  AddLinkClicked: 'addLinkClicked',
  SelectionChanged: 'selectionChanged',
  ColorChanged: 'colorChanged',
  WidthChanged: 'widthChanged',
  RemoveNode: 'removeNode',
  NodesUpdated: 'nodesUpdated',
  LinksUpdated: 'linksUpdated',
  OffsetUpdated: 'offsetUpdated',
  ZoomUpdated: 'zoomUpdated',
  GridUpdated: 'gridUpdated',
  EntityRemoved: 'entityRemoved',
  SourcePortChanged: 'sourcePortChanged',
  TargetPortChanged: 'targetPortChanged'
}

export const DiagramType: { [key: string]: string } = {
  Default: 'default',
  CreateNew: 'create-new',
  DiamondNode: 'default-diamond',
  StartNode: 'node-start'
}
