// TODO: replace all with DTO

import type { Graph } from './GraphTypes'

export enum BuildExecutionStatus {
  IN_PROGRESS = 'in_progress'
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
  pipeline: Pipeline
  triggerType: string
  event: string
  author: Author
  branch?: Branch
  pullRequest?: PullRequest
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
