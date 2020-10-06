import { createContext, useContext } from 'react'

import type { PipelineExecutionDetail, StageExecutionSummaryDTO } from 'services/cd-ng'

import { ExecutionTab } from '../ExecutionConstants'

export interface ExecutionContextParams {
  currentTab: ExecutionTab
  pipelineExecutionDetail: PipelineExecutionDetail | null
  pipelineStagesMap: Map<string, StageExecutionSummaryDTO>
}

const ExecutionConext = createContext<ExecutionContextParams>({
  currentTab: ExecutionTab.PIPELINE,
  pipelineExecutionDetail: null,
  pipelineStagesMap: new Map()
})

export default ExecutionConext

export function useExecutionContext(): ExecutionContextParams {
  return useContext(ExecutionConext)
}
