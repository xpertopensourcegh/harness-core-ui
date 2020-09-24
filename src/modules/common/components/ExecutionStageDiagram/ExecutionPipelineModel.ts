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
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
  ABORTED = 'ABORTED',
  ERROR = 'ERROR',
  PAUSED = 'PAUSED',
  PAUSING = 'PAUSING',
  WAITING = 'WAITING',
  ABORTING = 'ABORTING',
  RUNNING = 'RUNNING',
  QUEUED = 'QUEUED',
  SKIPPED = 'SKIPPED',
  STARTING = 'STARTING',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  ASYNC_WAITING = 'ASYNC_WAITING'
}

export interface ExecutionPipelineItem<T> {
  identifier: string
  name: string
  type: ExecutionPipelineItemType
  status: ExecutionPipelineItemStatus
  icon: IconName
  cssProps?: React.CSSProperties
  data?: T
  pipeline?: ExecutionPipeline<T>
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
