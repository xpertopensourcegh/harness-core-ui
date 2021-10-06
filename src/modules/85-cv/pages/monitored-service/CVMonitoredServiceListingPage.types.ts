export interface FilterEnvInterface {
  searchTerm?: string
  environmentIdentifier?: string
}

export interface ContextMenuActionsProps {
  onEdit?(): void
  onDelete?(): void
  titleText: string
  contentText: string
  deleteLabel?: string
  editLabel?: string
}
