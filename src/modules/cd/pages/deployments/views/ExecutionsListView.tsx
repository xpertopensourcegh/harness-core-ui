import React from 'react'
import type { ResponsePagePipelineExecutionSummaryDTO } from 'services/cd-ng'
import { ExecutionCard } from '../components/ExecutionCard/ExecutionCard'

export interface ExecutionsListViewProps {
  pipelineExecutionSummary: ResponsePagePipelineExecutionSummaryDTO | null
}

export const ExecutionsListView: React.FC<ExecutionsListViewProps> = ({ pipelineExecutionSummary }) => {
  return (
    <>
      {pipelineExecutionSummary?.data?.content?.map(pipelineExecution => (
        <ExecutionCard pipelineExecution={pipelineExecution} key={pipelineExecution.planExecutionId} />
      ))}
    </>
  )
}
