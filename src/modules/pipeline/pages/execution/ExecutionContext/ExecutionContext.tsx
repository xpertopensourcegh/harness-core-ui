import { createContext, useContext } from 'react'

import type { PipelineExecutionDetail, StageExecutionSummaryDTO } from 'services/cd-ng'

export interface ExecutionContextParams {
  pipelineExecutionDetail: PipelineExecutionDetail | null
  pipelineStagesMap: Map<string, StageExecutionSummaryDTO>
  autoSelectedStageId: string
  autoSelectedStepId: string
  queryParams: Record<string, any>
}

const ExecutionConext = createContext<ExecutionContextParams>({
  pipelineExecutionDetail: null,
  pipelineStagesMap: new Map(),
  autoSelectedStageId: '',
  autoSelectedStepId: '',
  queryParams: {}
})

export default ExecutionConext

export function useExecutionContext(): ExecutionContextParams {
  return useContext(ExecutionConext)
}
