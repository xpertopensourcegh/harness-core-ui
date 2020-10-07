import React from 'react'
import { useParams, useLocation, NavLink, Link } from 'react-router-dom'
import { Button } from '@wings-software/uikit'
import cx from 'classnames'
import qs from 'qs'

import { routeCDPipelineExecutionGraph, routeCDPipelineExecutionLog, routeCDDeployments } from 'modules/cd/routes'
import { useGetPipelineExecutionDetail } from 'services/cd-ng'
import { ExecutionStatusLabel } from 'modules/common/components/ExecutionStatusLabel/ExecutionStatusLabel'
import { Duration } from 'modules/common/components/Duration/Duration'
import type { ExecutionStatus } from 'modules/common/exports'
import { PageSpinner } from 'modules/common/components/Page/PageSpinner'

import { getPipelineStagesMap, isExecutionComplete } from './ExecutionUtils'
import { ExecutionTab } from './ExecutionConstants'
import ExecutionActions from './ExecutionActions/ExecutionActions'
import ExecutionContext from './ExecutionContext/ExecutionContext'
import ExecutionMetadata from './ExecutionMetadata/ExecutionMetadata'
import ExecutionTabs from './ExecutionTabs/ExecutionTabs'
import RightBar from './RightBar/RightBar'
import css from './Execution.module.scss'

export interface ExecutionPathParams {
  orgIdentifier: string
  projectIdentifier: string
  pipelineIdentifier: string
  executionIdentifier: string
  accountId: string
}

const POLL_INTERVAL = 30 /* sec */ * 1000 /* ms */

export default function Execution(props: React.PropsWithChildren<{}>): React.ReactElement {
  const [currentTab, setCurrentTab] = React.useState<ExecutionTab>(ExecutionTab.PIPELINE)
  const [showDetail, setShowDetails] = React.useState(false)
  const { orgIdentifier, projectIdentifier, pipelineIdentifier, executionIdentifier, accountId } = useParams<
    ExecutionPathParams
  >()
  const location = useLocation()
  const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true })

  const { data, refetch, loading } = useGetPipelineExecutionDetail({
    planExecutionId: executionIdentifier,
    queryParams: {
      orgIdentifier,
      projectIdentifier,
      accountIdentifier: accountId,
      stageIdentifier: queryParams.stage as string
    }
  })

  const pipelineStagesMap = React.useMemo(() => {
    return getPipelineStagesMap(data || {})
  }, [data])

  React.useEffect(() => {
    if (data && !isExecutionComplete(data.data?.pipelineExecution?.executionStatus)) {
      const timerId = window.setTimeout(() => {
        refetch()
      }, POLL_INTERVAL)

      return () => {
        window.clearTimeout(timerId)
      }
    }
  }, [data, refetch])

  function toggleDetails(): void {
    setShowDetails(status => !status)
  }

  const { pipelineExecution = {} } = data?.data || {}

  return (
    <ExecutionContext.Provider value={{ currentTab, pipelineExecutionDetail: data?.data || null, pipelineStagesMap }}>
      {loading && !data ? <PageSpinner /> : null}
      <main className={css.main}>
        <div className={css.lhs}>
          <header className={cx(css.header, { [css.showDetails]: showDetail })}>
            <div className={css.breadcrumbs}>
              <Link to={routeCDDeployments.url({ orgIdentifier, projectIdentifier })}>Deployments</Link>
            </div>
            <div className={css.headerTopRow}>
              <div className={css.titleContainer}>
                <div className={css.title}>{pipelineExecution.pipelineName}</div>
                <div className={css.pipelineId}>(Execution ID: {pipelineExecution.planExecutionId})</div>
              </div>
              <div className={css.statusBar}>
                {pipelineExecution.executionStatus && (
                  <ExecutionStatusLabel
                    className={css.statusLabel}
                    status={pipelineExecution.executionStatus as ExecutionStatus}
                  />
                )}
                <Duration
                  startTime={pipelineExecution.startedAt}
                  endTime={pipelineExecution.endedAt}
                  durationText={' '}
                />
                <ExecutionActions executionStatus={pipelineExecution.executionStatus} />
              </div>
            </div>
            <div className={css.headerBottomRow}>
              <Button
                className={css.toggleDetails}
                icon={showDetail ? 'chevron-down' : 'chevron-right'}
                small
                iconProps={{ size: 14 }}
                onClick={toggleDetails}
              />
            </div>
          </header>
          {showDetail ? <ExecutionMetadata /> : null}
          <ExecutionTabs currentTab={currentTab} onTabChange={setCurrentTab}>
            <div className={css.viewStatus}>
              <div className={css.viewToggle}>
                <NavLink
                  activeClassName={css.active}
                  to={routeCDPipelineExecutionGraph.url({
                    orgIdentifier,
                    projectIdentifier,
                    pipelineIdentifier,
                    executionIdentifier
                  })}
                >
                  Graph View
                </NavLink>
                <NavLink
                  activeClassName={css.active}
                  to={routeCDPipelineExecutionLog.url({
                    orgIdentifier,
                    projectIdentifier,
                    pipelineIdentifier,
                    executionIdentifier
                  })}
                >
                  Log View
                </NavLink>
              </div>
            </div>
          </ExecutionTabs>
          <div className={cx(css.childContainer, { [css.showDetails]: showDetail })} id="pipeline-execution-container">
            {props.children}
          </div>
        </div>
        <RightBar />
      </main>
    </ExecutionContext.Provider>
  )
}
