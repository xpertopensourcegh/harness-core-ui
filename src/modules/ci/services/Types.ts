import type { ExecutionPipeline } from 'modules/common/components/ExecutionStageDiagram/ExecutionPipelineModel'
// TODO: replace all with DTO

import type { Graph, GraphVertex } from './GraphTypes'

export enum BuildExecutionStatus {
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
  EXPIRED = 'EXPIRED'
}

export interface Pipeline {
  id: string
  name: string
}

export interface Author {
  id: string
  avatar: string
}

export interface Commit {
  id: string
  link: string
  message: string
  description?: string
  ownerName: string
  ownerId: string
  ownerEmail: string
}

export interface Branch {
  name: string
  link: string
  commits: Commit[]
}

export interface PullRequest {
  id: number
  link: string
  title: string
  body: string
  sourceBranch: string
  targetBranch: string
  state: string
}

export interface Build {
  id: number
  status: BuildExecutionStatus
  startTime: number
  endTime: number
  pipeline?: Pipeline
  triggerType: string
  event: string
  author?: Author
  branch?: Branch
  pullRequest?: PullRequest
  graph: Graph
}

export interface BuildsData {
  content: Build[]
  graph: Graph
  pageCount: number
  itemCount: number
  pageSize: number
  pageIndex: number
  empty: boolean
}

export interface BuildsResponse {
  status: string
  data: BuildsData
  metaData?: any
  correlationId?: any
}

export interface BuildResponse {
  status: string
  data: Build
  metaData?: any
  correlationId?: any
}

export interface BuildData {
  response: BuildResponse
  stagePipeline: ExecutionPipeline<GraphVertex>
  defaultSelectedStageIdentifier: string
  defaultSelectedStepIdentifier: string
}
