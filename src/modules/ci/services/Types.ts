// TODO: replace all with DTO

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

export interface Sort {
  unsorted: boolean
  sorted: boolean
  empty: boolean
}

export interface Pageable {
  sort: Sort
  offset: number
  pageNumber: number
  pageSize: number
  paged: boolean
  unpaged: boolean
}

export interface BuildsData {
  content: Build[]
  pageable: Pageable
  totalPages: number
  totalElements: number
  last: boolean
  size: number
  number: number
  first: boolean
  sort: Sort
  numberOfElements: number
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
