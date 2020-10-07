// TODO: temporary model, replace with TDO or update

export interface GraphVertex {
  uuid: string
  name: string
  startTs: number
  endTs: number
  lastUpdatedAt: number
  stepType?: any
  status: string
  stepParameters: any
  interruptHistories: any[]
  outcomes: any[]
  retryIds: any[]
}

export interface Graph {
  planExecutionId: string
  startTs: number
  endTs: number
  status: string
  rootNodeIds: Array<string>
  adjacencyList: {
    graphVertexMap: { [id: string]: GraphVertex }
    adjacencyMap: { [id: string]: EdgeList }
  }
}

export interface EdgeList {
  edges: Array<string>
  nextIds: Array<string>
}
