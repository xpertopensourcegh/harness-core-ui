import type { IconName } from '@wings-software/uikit'

// TODO: should be replaced with type-shape of the box (like: Stage, Step, Approval)
export enum ExecutionPipelineItemType {
  DEPLOY = 'Deployment',
  APPROVAL = 'Approval',
  PIPELINE = 'Pipeline',
  CUSTOM = 'Custom'
}

// TODO: should be replaced or same as DTO
export enum ExecutionPipelineItemStatus {
  FAILED = 'Failed',
  SUCCESS = 'Success',
  RUNNING = 'Running',
  PENDING = 'Pending'
}

export interface ExecutionPipelineItem<T> {
  identifier: string
  name: string
  type: ExecutionPipelineItemType
  status: ExecutionPipelineItemStatus
  icon: IconName
  cssProps?: React.CSSProperties
  data?: T
}

export interface ExecutionPipelineGroupInfo<T> {
  identifier: string
  name: string
  data: T
}
export interface ExecutionPipelineNode<T> {
  item: ExecutionPipelineItem<T>
  parallel?: Array<ExecutionPipelineNode<T>>
}

export interface ExecutionPipeline<T> {
  items: Array<ExecutionPipelineNode<T>>
}
