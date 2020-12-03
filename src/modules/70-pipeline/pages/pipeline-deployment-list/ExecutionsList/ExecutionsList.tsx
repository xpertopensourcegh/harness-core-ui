import React from 'react'
import { Text } from '@wings-software/uikit'
import { String } from 'framework/exports'
import type { ResponsePagePipelineExecutionSummaryDTO } from 'services/cd-ng'

import ExecutionCard from './ExecutionCard/ExecutionCard'
import css from './ExecutionList.module.scss'

export interface ExecutionsListProps {
  pipelineExecutionSummary: ResponsePagePipelineExecutionSummaryDTO | null
  hasFilters?: boolean
}

export default function ExecutionsList({
  pipelineExecutionSummary,
  hasFilters
}: ExecutionsListProps): React.ReactElement {
  return (
    <div className={css.main}>
      {hasFilters && !pipelineExecutionSummary?.data?.content?.length ? (
        <Text>
          <String stringID="noSearchResultsFoundPeriod" />
        </Text>
      ) : null}
      {pipelineExecutionSummary?.data?.content?.map(pipelineExecution => (
        <ExecutionCard pipelineExecution={pipelineExecution} key={pipelineExecution.planExecutionId} />
      ))}
    </div>
  )
}
