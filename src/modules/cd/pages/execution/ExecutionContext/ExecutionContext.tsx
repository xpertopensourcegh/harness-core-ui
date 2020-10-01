import { createContext } from 'react'

import type { PipelineExecutionDetail } from 'services/cd-ng'

import { ExecutionTab } from '../ExecutionConstants'

export interface ExecutionContextParams {
  currentTab: ExecutionTab
  pipelineExecutionDetail: PipelineExecutionDetail | null
}

const ExecutionConext = createContext<ExecutionContextParams>({
  currentTab: ExecutionTab.PIPELINE,
  pipelineExecutionDetail: null
})

export default ExecutionConext
