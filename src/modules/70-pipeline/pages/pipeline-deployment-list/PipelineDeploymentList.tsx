import React from 'react'
import { useParams, useLocation } from 'react-router-dom'
import qs from 'qs'

import { useGetListOfExecutions } from 'services/cd-ng'
import { useStrings } from 'framework/exports'
import { Page } from '@common/exports'

import ExecutionsFilter from './ExecutionsFilter/ExecutionsFilter'
import ExecutionsList from './ExecutionsList/ExecutionsList'
import ExecutionsPagination from './ExecutionsPagination/ExecutionsPagination'
import css from './PipelineDeploymentList.module.scss'

const pollingIntervalInMilliseconds = 5_000

export interface PipelineDeploymentListProps {
  onRunPipeline(): void
}

export default function PipelineDeploymentList(props: PipelineDeploymentListProps): React.ReactElement {
  const { pipelineIdentifier, orgIdentifier, projectIdentifier, accountId } = useParams()
  const location = useLocation()
  const query = qs.parse(location.search, { ignoreQueryPrefix: true })
  const page = parseInt((query.page as string) || '1', 10)
  const { getString } = useStrings()

  const { loading, data: pipelineExecutionSummary, error, refetch } = useGetListOfExecutions({
    queryParams: {
      accountIdentifier: accountId,
      projectIdentifier,
      orgIdentifier,
      pipelineIdentifiers: [pipelineIdentifier as string],
      page: page - 1
    },
    queryParamStringifyOptions: {
      arrayFormat: 'repeat'
    }
  })

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
  }, [page, refetch, loading])

  return (
    <Page.Body
      className={css.main}
      loading={loading}
      error={error?.message}
      retryOnError={() => refetch?.()}
      noData={{
        when: () => !pipelineExecutionSummary?.data?.content?.length,
        icon: 'cd-hover',
        message: getString('noDeploymentText'),
        buttonText: getString('runPipelineText'),
        onClick: props.onRunPipeline
      }}
    >
      <ExecutionsFilter onRunPipeline={props.onRunPipeline} />
      <ExecutionsList pipelineExecutionSummary={pipelineExecutionSummary} />
      <ExecutionsPagination pipelineExecutionSummary={pipelineExecutionSummary} />
    </Page.Body>
  )
  // }
}
