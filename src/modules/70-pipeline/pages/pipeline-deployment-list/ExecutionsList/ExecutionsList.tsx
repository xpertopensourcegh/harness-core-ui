import React from 'react'
import type { ResponsePagePipelineExecutionSummaryDTO } from 'services/cd-ng'

import ExecutionCard from './ExecutionCard/ExecutionCard'
import css from './ExecutionList.module.scss'

export interface ExecutionsListProps {
  pipelineExecutionSummary: ResponsePagePipelineExecutionSummaryDTO | null
}

export default function ExecutionsList({ pipelineExecutionSummary }: ExecutionsListProps): React.ReactElement {
  return (
    <div className={css.main}>
      {pipelineExecutionSummary?.data?.content?.map(pipelineExecution => (
        <ExecutionCard pipelineExecution={pipelineExecution} key={pipelineExecution.planExecutionId} />
      ))}
    </div>
  )
}
