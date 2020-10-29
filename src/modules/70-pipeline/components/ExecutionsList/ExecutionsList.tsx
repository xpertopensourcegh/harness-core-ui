import React from 'react'
import type { ResponsePagePipelineExecutionSummaryDTO } from 'services/cd-ng'
import { ExecutionCard } from '../ExecutionCard/ExecutionCard'

export interface ExecutionsListProps {
  pipelineExecutionSummary: ResponsePagePipelineExecutionSummaryDTO | null
}

export const ExecutionsList: React.FC<ExecutionsListProps> = ({ pipelineExecutionSummary }) => {
  return (
    <>
      {pipelineExecutionSummary?.data?.content?.map(pipelineExecution => (
        <ExecutionCard pipelineExecution={pipelineExecution} key={pipelineExecution.planExecutionId} />
      ))}
    </>
  )
}
