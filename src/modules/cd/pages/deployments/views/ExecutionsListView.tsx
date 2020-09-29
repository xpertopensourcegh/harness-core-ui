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
      {/* <ExecutionCard status={ExecutionStatus.NOT_STARTED} />
      <ExecutionCard status={ExecutionStatus.FAILED} />
      <ExecutionCard status={ExecutionStatus.SUCCESS} />
      <ExecutionCard status={ExecutionStatus.ABORTED} />
      <ExecutionCard status={ExecutionStatus.ERROR} />
      <ExecutionCard status={ExecutionStatus.PAUSED} />
      <ExecutionCard status={ExecutionStatus.PAUSING} />
      <ExecutionCard status={ExecutionStatus.WAITING} />
      <ExecutionCard status={ExecutionStatus.ABORTING} />
      <ExecutionCard status={ExecutionStatus.RUNNING} />
      <ExecutionCard status={ExecutionStatus.QUEUED} />
      <ExecutionCard status={ExecutionStatus.SKIPPED} />
      <ExecutionCard status={ExecutionStatus.STARTING} />
      <ExecutionCard status={ExecutionStatus.REJECTED} />
      <ExecutionCard status={ExecutionStatus.EXPIRED} /> */}
    </>
  )
}
