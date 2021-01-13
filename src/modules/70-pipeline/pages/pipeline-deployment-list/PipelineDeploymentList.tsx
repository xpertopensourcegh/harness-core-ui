import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import {
  useGetListOfExecutions,
  PagePipelineExecutionSummary,
  GetListOfExecutionsQueryParams
} from 'services/pipeline-ng'
import { useStrings } from 'framework/exports'
import { Page, useToaster } from '@common/exports'
import { useQueryParams } from '@common/hooks'
import type { PipelinePathProps } from '@common/interfaces/RouteInterfaces'
import type { PipelineType } from '@common/interfaces/RouteInterfaces'
import { useDocumentTitle } from '@common/hooks/useDocumentTitle'
import ExecutionsFilter, { FilterQueryParams } from './ExecutionsFilter/ExecutionsFilter'
import ExecutionsList from './ExecutionsList/ExecutionsList'
import ExecutionsPagination from './ExecutionsPagination/ExecutionsPagination'
import css from './PipelineDeploymentList.module.scss'

const pollingIntervalInMilliseconds = 5_000

export interface PipelineDeploymentListProps {
  onRunPipeline(): void
}

export default function PipelineDeploymentList(props: PipelineDeploymentListProps): React.ReactElement {
  const [pipelineExecutionSummary, setPipelineExecutionSummary] = useState<PagePipelineExecutionSummary>()
  const [error, setError] = useState<Error>()
  const { orgIdentifier, projectIdentifier, pipelineIdentifier, accountId, module } = useParams<
    PipelineType<PipelinePathProps>
  >()
  const queryParams = useQueryParams<{ page?: string } & FilterQueryParams>()
  const page = parseInt(queryParams.page || '1', 10)
  const [initLoading, setInitLoading] = React.useState(true)
  const { getString } = useStrings()
  const { showError } = useToaster()
  useDocumentTitle([getString('pipelines'), getString('executionsText')])

  const { loading, mutate: fetchListOfExecutions } = useGetListOfExecutions({
    queryParams: {
      accountIdentifier: accountId,
      projectIdentifier,
      orgIdentifier,
      pipelineIdentifier,
      page: page - 1
    },
    queryParamStringifyOptions: {
      arrayFormat: 'repeat'
    }
  })

  const fetchExecutions = React.useCallback(
    async (params?: GetListOfExecutionsQueryParams): Promise<void> => {
      try {
        const { status, data } = await fetchListOfExecutions(
          {
            filterType: 'Pipeline'
          },
          { queryParams: params }
        )
        if (status === 'SUCCESS') {
          setInitLoading(false)
          setPipelineExecutionSummary(data)
        }
      } catch (e) {
        showError(e.data?.message || e.message)
        setError(e)
      }
    },
    [fetchListOfExecutions, showError]
  )

  useEffect(() => {
    fetchExecutions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const hasFilters: boolean = !!queryParams.query || !!queryParams.pipeline || !!queryParams.status
  const isCIModule = module === 'ci'

  // Polling logic:
  //  - At any moment of time, only one polling is done
  //  - Only do polling on first page
  //  - When component is loading, wait until loading is done
  //  - When polling call (API) is being processed, wait until it's done then re-schedule
  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (page === 1 && !loading) {
        fetchExecutions({
          accountIdentifier: accountId,
          projectIdentifier,
          orgIdentifier,
          pipelineIdentifier,
          page: page - 1
        })
      }
    }, pollingIntervalInMilliseconds)

    return () => {
      window.clearTimeout(timeoutId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, loading, accountId, projectIdentifier, orgIdentifier, pipelineIdentifier])

  return (
    <Page.Body
      className={css.main}
      loading={initLoading}
      error={error?.message}
      retryOnError={() => fetchExecutions()}
      noData={{
        when: () => !hasFilters && !pipelineExecutionSummary?.content?.length,
        icon: isCIModule ? 'ci-main' : 'cd-hover',
        noIconColor: isCIModule,
        message: getString(isCIModule ? 'noBuildsText' : 'noDeploymentText'),
        buttonText: getString('runPipelineText'),
        onClick: props.onRunPipeline
      }}
    >
      <ExecutionsFilter onRunPipeline={props.onRunPipeline} />
      <ExecutionsList hasFilters={hasFilters} pipelineExecutionSummary={pipelineExecutionSummary?.content} />
      <ExecutionsPagination pipelineExecutionSummary={pipelineExecutionSummary} />
    </Page.Body>
  )
}
