// TODO: temporary model, replace with TDO or update

export interface Subgraph {
  mode: string
  vertices?: GraphVertex[]
}

export interface GraphVertex {
  uuid: string
  name: string
  startTs: number
  lastUpdatedAt: number
  stepType?: any
  status: string
  stepParameters: any
  interruptHistories: any[]
  outcomes: any[]
  retryIds: any[]
  subgraph?: Subgraph
  next?: GraphVertex
}

export interface Graph {
  cacheContextOrder: number
  cacheKey: string
  planExecutionId: string
  startTs: number
  status: string
  graphVertex: GraphVertex
  lastUpdatedAt: number
}
