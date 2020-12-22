import React from 'react'
import { useParams } from 'react-router-dom'
import { Button, Icon, Tag } from '@wings-software/uikit'
import cx from 'classnames'

import { isEmpty } from 'lodash-es'
import routes from '@common/RouteDefinitions'
import { useGetExecutionDetail } from 'services/pipeline-ng'
import { Duration } from '@common/components/Duration/Duration'
import { PageSpinner } from '@common/components/Page/PageSpinner'
import { Breadcrumbs } from '@common/components/Breadcrumbs/Breadcrumbs'
import { String, useAppStore, useStrings } from 'framework/exports'

import ExecutionStatusLabel from '@pipeline/components/ExecutionStatusLabel/ExecutionStatusLabel'
import { isExecutionComplete } from '@pipeline/utils/statusHelpers'
import ExecutionActions from '@pipeline/components/ExecutionActions/ExecutionActions'
import {
  getPipelineStagesMap,
  ExecutionPathParams,
  getRunningStageForPipeline,
  getRunningStep
} from '@pipeline/utils/executionUtils'
import { useQueryParams } from '@common/hooks'
import type { ExecutionPageQueryParams } from '@pipeline/utils/types'

import type { PipelineType } from '@common/interfaces/RouteInterfaces'
import ExecutionContext from '../ExecutionContext/ExecutionContext'
import ExecutionMetadata from './ExecutionMetadata/ExecutionMetadata'
import ExecutionTabs from './ExecutionTabs/ExecutionTabs'
import RightBar from './RightBar/RightBar'

import css from './ExecutionLandingPage.module.scss'

export const POLL_INTERVAL = 5 /* sec */ * 1000 /* ms */

export default function ExecutionLandingPage(props: React.PropsWithChildren<{}>): React.ReactElement {
  const [showDetail, setShowDetails] = React.useState(false)
  const { orgIdentifier, projectIdentifier, executionIdentifier, accountId, pipelineIdentifier, module } = useParams<
    PipelineType<ExecutionPathParams>
  >()

  /* These are used when auto updating selected stage/step when a pipeline is running */
  const [autoSelectedStageId, setAutoSelectedStageId] = React.useState('')
  const [autoSelectedStepId, setAutoSelectedStepId] = React.useState('')

  /* These are updated only when new data is fetched successfully */
  const [selectedStageId, setSelectedStageId] = React.useState('')
  const [selectedStepId, setSelectedStepId] = React.useState('')
  const queryParams = useQueryParams<ExecutionPageQueryParams>()

  const { data, refetch, loading } = useGetExecutionDetail({
    planExecutionId: executionIdentifier,
    queryParams: {
      orgIdentifier,
      projectIdentifier,
      accountIdentifier: accountId,
      stageNodeId: isEmpty(queryParams.stage || autoSelectedStageId)
        ? undefined
        : queryParams.stage || autoSelectedStageId
    },
    debounce: 500
  })

  const { selectedProject } = useAppStore()
  const project = selectedProject
  const { getString } = useStrings()
  const pipelineStagesMap = React.useMemo(() => {
    return getPipelineStagesMap(
      data?.data?.pipelineExecutionSummary?.layoutNodeMap,
      data?.data?.pipelineExecutionSummary?.startingNodeId
    )
  }, [data?.data?.pipelineExecutionSummary?.layoutNodeMap, data?.data?.pipelineExecutionSummary?.startingNodeId])

  function toggleDetails(): void {
    setShowDetails(status => !status)
  }

  // setup polling
  React.useEffect(() => {
    if (!loading && data && !isExecutionComplete(data.data?.pipelineExecutionSummary?.status)) {
      const timerId = window.setTimeout(() => {
        refetch()
      }, POLL_INTERVAL)

      return () => {
        window.clearTimeout(timerId)
      }
    }
  }, [data, refetch, loading])

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
      data.data.pipelineExecutionSummary,
      data.data?.pipelineExecutionSummary?.status
    )

    const runningStep = getRunningStep(data.data.executionGraph || {})

    if (runningStage) {
      setAutoSelectedStageId(runningStage)
    }

    if (runningStep) {
      setAutoSelectedStepId(runningStep)
    }
  }, [queryParams, data])

  // update stage/step selection
  React.useEffect(() => {
    if (loading) {
      setSelectedStageId((queryParams.stage as string) || autoSelectedStageId)
    }
    setSelectedStepId((queryParams.step as string) || autoSelectedStepId)
  }, [loading, queryParams, autoSelectedStageId, autoSelectedStepId])

  const { pipelineExecutionSummary = {} } = data?.data || {}

  return (
    <ExecutionContext.Provider
      value={{
        pipelineExecutionDetail: data?.data || null,
        pipelineStagesMap,
        selectedStageId,
        selectedStepId,
        loading,
        queryParams
      }}
    >
      {loading && !data ? <PageSpinner /> : null}
      <main className={css.main}>
        <div className={css.lhs}>
          <header className={cx(css.header, { [css.showDetails]: showDetail })}>
            <Breadcrumbs
              links={[
                {
                  url: routes.toCDProjectOverview({ orgIdentifier, projectIdentifier, accountId }),
                  label: project?.name as string
                },
                {
                  url: routes.toPipelines({ orgIdentifier, projectIdentifier, accountId, module }),
                  label: getString('pipelines')
                },
                {
                  url: routes.toPipelineDeploymentList({
                    orgIdentifier,
                    projectIdentifier,
                    pipelineIdentifier,
                    accountId,
                    module
                  }),
                  label: getString('executionText')
                },
                { url: '#', label: pipelineExecutionSummary.name || '' }
              ]}
            />
            <div className={css.headerTopRow}>
              <div className={css.titleContainer}>
                <div className={css.title}>{pipelineExecutionSummary.name}</div>
                <div className={css.pipelineId}>
                  <String
                    stringID="execution.pipelineIdentifierText"
                    namespace="pipeline-execution-ci"
                    vars={pipelineExecutionSummary}
                  />
                </div>
              </div>
              <div className={css.statusBar}>
                {pipelineExecutionSummary.status && (
                  <ExecutionStatusLabel className={css.statusLabel} status={pipelineExecutionSummary.status} />
                )}
                <Duration
                  startTime={pipelineExecutionSummary.startTs}
                  endTime={pipelineExecutionSummary.endTs}
                  durationText={' '}
                />
                <ExecutionActions
                  executionStatus={pipelineExecutionSummary.status}
                  // inputSetYAML={pipelineExecutionSummary.inputSetYaml}
                  refetch={refetch}
                  params={{
                    orgIdentifier,
                    pipelineIdentifier,
                    projectIdentifier,
                    accountId,
                    executionIdentifier,
                    module
                  }}
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
                {pipelineExecutionSummary.tags &&
                  (Object.entries(pipelineExecutionSummary.tags) || []).map(tag => (
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
