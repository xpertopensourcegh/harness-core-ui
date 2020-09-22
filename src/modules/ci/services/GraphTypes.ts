// TODO: temporary model, replace with TDO or update

export interface Vertice {
  uuid: string
  name: string
  lastUpdatedAt: number
  steptype?: any
  status: string
  stepParameters: any
  interruptHistories: any[]
  outcomes: any[]
  retryIds: any[]
  subgraph: Subgraph
}

export interface Subgraph {
  mode: string
  vertices: Vertice[]
}

export interface GraphVertex {
  uuid: string
  name: string
  startTs: number
  lastUpdatedAt: number
  steptype?: any
  status: string
  stepParameters: any
  interruptHistories: any[]
  outcomes: any[]
  retryIds: any[]
  subgraph: Subgraph
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
