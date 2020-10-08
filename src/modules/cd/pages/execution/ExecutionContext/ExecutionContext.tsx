import { createContext, useContext } from 'react'

import type { PipelineExecutionDetail, StageExecutionSummaryDTO } from 'services/cd-ng'

export interface ExecutionContextParams {
  pipelineExecutionDetail: PipelineExecutionDetail | null
  pipelineStagesMap: Map<string, StageExecutionSummaryDTO>
}

const ExecutionConext = createContext<ExecutionContextParams>({
  pipelineExecutionDetail: null,
  pipelineStagesMap: new Map()
})

export default ExecutionConext

export function useExecutionContext(): ExecutionContextParams {
  return useContext(ExecutionConext)
}
