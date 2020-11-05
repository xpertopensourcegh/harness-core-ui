import React from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useModalHook } from '@wings-software/uikit'
import { Dialog } from '@blueprintjs/core'
import qs from 'qs'

import { useGetListOfExecutions } from 'services/cd-ng'
import { runPipelineDialogProps } from '@pipeline/components/RunPipelineModal/RunPipelineModal'
import { RunPipelineForm } from '@pipeline/components/RunPipelineModal/RunPipelineForm'
import { Page } from '@common/exports'

import ExecutionsFilter from './ExecutionsFilter/ExecutionsFilter'
import ExecutionsList from './ExecutionsList/ExecutionsList'
import ExecutionsPagination from './ExecutionsPagination/ExecutionsPagination'
import i18n from './PipelineDeploymentList.i18n'
import css from './PipelineDeploymentList.module.scss'

const pollingIntervalInMilliseconds = 5_000

export default function PipelineDeploymentList(): React.ReactElement {
  const { pipelineIdentifier, orgIdentifier, projectIdentifier, accountId } = useParams()
  const location = useLocation()
  const query = qs.parse(location.search, { ignoreQueryPrefix: true })
  const page = parseInt((query.page as string) || '1', 10)
  const [isRunPipelineOpen, setRunPipelineOpen] = React.useState(true)

  const [openModel, hideModel] = useModalHook(
    () => (
      <Dialog isOpen={isRunPipelineOpen} {...runPipelineDialogProps}>
        <RunPipelineForm pipelineIdentifier={pipelineIdentifier} onClose={closeModel} />
      </Dialog>
    ),
    [pipelineIdentifier]
  )

  const closeModel = React.useCallback(() => {
    setRunPipelineOpen(false)
    hideModel()
  }, [hideModel])

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
        message: i18n.noDeployment,
        buttonText: i18n.runPipeline,
        onClick: openModel
      }}
    >
      <ExecutionsFilter />
      <ExecutionsList pipelineExecutionSummary={pipelineExecutionSummary} />
      <ExecutionsPagination pipelineExecutionSummary={pipelineExecutionSummary} />
    </Page.Body>
  )
  // }
}
