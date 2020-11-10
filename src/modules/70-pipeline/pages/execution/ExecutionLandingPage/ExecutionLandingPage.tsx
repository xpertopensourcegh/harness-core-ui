import React from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { Button, Icon, Tag } from '@wings-software/uikit'
import cx from 'classnames'
import qs from 'qs'

import { routePipelineDeploymentList, routeCDDashboard, routeCDPipelines } from 'navigation/cd/routes'
import { useGetPipelineExecutionDetail } from 'services/cd-ng'
import { Duration } from '@common/components/Duration/Duration'
import { PageSpinner } from '@common/components/Page/PageSpinner'
import { String, useAppStoreReader, useStrings } from 'framework/exports'

import ExecutionStatusLabel from '@pipeline/components/ExecutionStatusLabel/ExecutionStatusLabel'
import { isExecutionComplete } from '@pipeline/utils/statusHelpers'
import ExecutionActions from '@pipeline/components/ExecutionActions/ExecutionActions'

import { Breadcrumbs } from '@common/components/Breadcrumbs/Breadcrumbs'
import ExecutionContext from '../ExecutionContext/ExecutionContext'
import {
  getPipelineStagesMap,
  ExecutionPathParams,
  getRunningStageForPipeline,
  getRunningStep
} from '../ExecutionUtils'

import ExecutionMetadata from './ExecutionMetadata/ExecutionMetadata'
import ExecutionTabs from './ExecutionTabs/ExecutionTabs'
import RightBar from './RightBar/RightBar'

import css from './ExecutionLandingPage.module.scss'

export const POLL_INTERVAL = 5 /* sec */ * 1000 /* ms */

export default function ExecutionLandingPage(props: React.PropsWithChildren<{}>): React.ReactElement {
  const location = useLocation()

  const [showDetail, setShowDetails] = React.useState(false)
  const { orgIdentifier, projectIdentifier, executionIdentifier, accountId, pipelineIdentifier } = useParams<
    ExecutionPathParams
  >()
  const [autoSelectedStageId, setAutoSelectedStageId] = React.useState('')
  const [autoSelectedStepId, setAutoSelectedStepId] = React.useState('')
  const queryParams = React.useMemo(() => qs.parse(location.search, { ignoreQueryPrefix: true }), [location.search])

  const { data, refetch, loading } = useGetPipelineExecutionDetail({
    planExecutionId: executionIdentifier,
    queryParams: {
      orgIdentifier,
      projectIdentifier,
      accountIdentifier: accountId,
      stageIdentifier: (queryParams.stage as string) || autoSelectedStageId
    },
    debounce: 500
  })

  const { projects } = useAppStoreReader()
  const project = projects.find(({ identifier }) => identifier === projectIdentifier)
  const { getString } = useStrings()
  const pipelineStagesMap = React.useMemo(() => {
    return getPipelineStagesMap(data || {})
  }, [data])

  React.useEffect(() => {
    if (!loading && data && !isExecutionComplete(data.data?.pipelineExecution?.executionStatus)) {
      const timerId = window.setTimeout(() => {
        refetch()
      }, POLL_INTERVAL)

      return () => {
        window.clearTimeout(timerId)
      }
    }
  }, [data, refetch, loading])

  function toggleDetails(): void {
    setShowDetails(status => !status)
  }

  // show the current running stage and steps automatically
  React.useEffect(() => {
    // if user has selected a stage/step do not auto-update
    if (queryParams.stage || queryParams.step) {
      setAutoSelectedStageId('')
      setAutoSelectedStepId('')
      return
    }

    // if no data is found, reset the stage and step
    if (!data || !data.data) {
      setAutoSelectedStageId('')
      setAutoSelectedStepId('')
      return
    }

    const runningStage = getRunningStageForPipeline(
      data.data.pipelineExecution?.stageExecutionSummaryElements || [],
      data.data?.pipelineExecution?.executionStatus
    )

    const runningStep = getRunningStep(data.data.stageGraph || {})

    if (runningStage) {
      setAutoSelectedStageId(runningStage)
    }

    if (runningStep) {
      setAutoSelectedStepId(runningStep)
    }
  }, [queryParams, data])

  const { pipelineExecution = {} } = data?.data || {}

  return (
    <ExecutionContext.Provider
      value={{
        pipelineExecutionDetail: data?.data || null,
        pipelineStagesMap,
        autoSelectedStageId,
        autoSelectedStepId,
        queryParams
      }}
    >
      {loading && !data ? <PageSpinner /> : null}
      <main className={css.main}>
        <div className={css.lhs}>
          <header className={cx(css.header, { [css.showDetails]: showDetail })}>
            <Breadcrumbs
              links={[
                { url: routeCDDashboard.url({ orgIdentifier, projectIdentifier }), label: project?.name as string },
                { url: routeCDPipelines.url({ orgIdentifier, projectIdentifier }), label: getString('pipelines') },
                {
                  url: routePipelineDeploymentList.url({ orgIdentifier, projectIdentifier, pipelineIdentifier }),
                  label: getString('executionText')
                },
                { url: '#', label: pipelineExecution.pipelineName || '' }
              ]}
            />
            <div className={css.headerTopRow}>
              <div className={css.titleContainer}>
                <div className={css.title}>{pipelineExecution.pipelineName}</div>
                <div className={css.pipelineId}>
                  <String
                    stringID="execution.pipelineIdentifierText"
                    namespace="pipeline-execution-ci"
                    vars={pipelineExecution}
                  />
                </div>
              </div>
              <div className={css.statusBar}>
                {pipelineExecution.executionStatus && (
                  <ExecutionStatusLabel className={css.statusLabel} status={pipelineExecution.executionStatus} />
                )}
                <Duration
                  startTime={pipelineExecution.startedAt}
                  endTime={pipelineExecution.endedAt}
                  durationText={' '}
                />
                <ExecutionActions
                  executionStatus={pipelineExecution.executionStatus}
                  inputSetYAML={pipelineExecution.inputSetYaml}
                  refetch={refetch}
                  params={{ orgIdentifier, pipelineIdentifier, projectIdentifier, accountId, executionIdentifier }}
                />
              </div>
            </div>
            <div className={css.headerBottomRow}>
              <Button
                className={css.toggleDetails}
                icon={showDetail ? 'chevron-down' : 'chevron-right'}
                small
                iconProps={{ size: 14 }}
                onClick={toggleDetails}
                data-testid="toggle-details"
              />
              <div className={css.tags}>
                <Icon name="main-tags" size={14} />
                {pipelineExecution.tags &&
                  (Object.entries(pipelineExecution.tags) || []).map(tag => (
                    <Tag className={css.tag} key={tag[0]}>
                      {tag[1].length > 0 ? `${tag[0]}: ${tag[1]}` : tag[0]}
                    </Tag>
                  ))}
              </div>
            </div>
          </header>
          {showDetail ? <ExecutionMetadata /> : null}
          <ExecutionTabs />
          <div className={cx(css.childContainer, { [css.showDetails]: showDetail })} id="pipeline-execution-container">
            {props.children}
          </div>
        </div>
        <RightBar />
      </main>
    </ExecutionContext.Provider>
  )
}
