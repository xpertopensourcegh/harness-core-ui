import React from 'react'
import { useParams } from 'react-router-dom'

import { useGetListOfExecutions } from 'services/pipeline-ng'
import { useStrings } from 'framework/exports'
import { Page } from '@common/exports'
import { useQueryParams } from '@common/hooks'
import type { PipelinePathProps } from '@common/interfaces/RouteInterfaces'

import ExecutionsFilter, { FilterQueryParams } from './ExecutionsFilter/ExecutionsFilter'
import ExecutionsList from './ExecutionsList/ExecutionsList'
import ExecutionsPagination from './ExecutionsPagination/ExecutionsPagination'
import css from './PipelineDeploymentList.module.scss'

const pollingIntervalInMilliseconds = 5_000

export interface PipelineDeploymentListProps {
  onRunPipeline(): void
}

export default function PipelineDeploymentList(props: PipelineDeploymentListProps): React.ReactElement {
  const { orgIdentifier, projectIdentifier, accountId } = useParams<PipelinePathProps>()
  const queryParams = useQueryParams<{ page?: string } & FilterQueryParams>()
  const page = parseInt(queryParams.page || '1', 10)
  const { getString } = useStrings()

  const { loading, data: pipelineExecutionSummary, error, refetch } = useGetListOfExecutions({
    queryParams: {
      accountIdentifier: accountId,
      projectIdentifier,
      orgIdentifier,
      // pipelineIdentifiers: pipelineIdentifier
      //   ? [pipelineIdentifier]
      //   : queryParams.pipeline
      //   ? [queryParams.pipeline]
      //   : undefined,
      page: page - 1
      // searchTerm: queryParams.query,
      // executionStatuses: queryParams.status ? [queryParams.status] : undefined
    },
    queryParamStringifyOptions: {
      arrayFormat: 'repeat'
    }
  })
  const hasFilters: boolean = !!queryParams.query || !!queryParams.pipeline || !!queryParams.status

  // Polling logic:
  //  - At any moment of time, only one polling is done
  //  - Only do polling on first page
  //  - When component is loading, wait until loading is done
  //  - When polling call (API) is being processed, wait until it's done then re-schedule
  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (page == 1 && !loading) {
        refetch()
      }
    }, pollingIntervalInMilliseconds)

    return () => {
      window.clearTimeout(timeoutId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, loading])

  return (
    <Page.Body
      className={css.main}
      loading={loading}
      error={error?.message}
      retryOnError={() => refetch?.()}
      noData={{
        when: () => !hasFilters && !pipelineExecutionSummary?.data?.content?.length,
        icon: 'cd-hover',
        message: getString('noDeploymentText'),
        buttonText: getString('runPipelineText'),
        onClick: props.onRunPipeline
      }}
    >
      <ExecutionsFilter onRunPipeline={props.onRunPipeline} />
      <ExecutionsList hasFilters={hasFilters} pipelineExecutionSummary={pipelineExecutionSummary?.data?.content} />
      <ExecutionsPagination pipelineExecutionSummary={pipelineExecutionSummary?.data} />
    </Page.Body>
  )
}
