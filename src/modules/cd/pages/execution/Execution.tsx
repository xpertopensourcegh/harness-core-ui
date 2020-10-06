import React from 'react'
import { useParams, useLocation, NavLink, Link } from 'react-router-dom'
import { Button, Icon } from '@wings-software/uikit'
import cx from 'classnames'
import qs from 'qs'

import { routeCDPipelineExecutionGraph, routeCDPipelineExecutionLog, routeCDDeployments } from 'modules/cd/routes'
import { useGetPipelineExecutionDetail } from 'services/cd-ng'
import { ExecutionStatusLabel } from 'modules/common/components/ExecutionStatusLabel/ExecutionStatusLabel'
import { Duration } from 'modules/common/components/Duration/Duration'
import type { ExecutionStatus } from 'modules/common/exports'

import { getPipelineStagesMap } from './ExecutionUtils'
import { ExecutionTab } from './ExecutionConstants'
import ExecutionActions from './ExecutionActions/ExecutionActions'
import ExecutionContext from './ExecutionContext/ExecutionContext'
import ExecutionMetadata from './ExecutionMetadata/ExecutionMetadata'
import ExecutionTabs from './ExecutionTabs/ExecutionTabs'
import RightBar from './RightBar/RightBar'
import css from './Execution.module.scss'

const TEMP_NOW = Date.now() - 10 * 1000

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

  const { data, refetch } = useGetPipelineExecutionDetail({
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
    if (data && !['COMPLETED', 'PAUSED', 'FAILED'].includes(data.data?.pipelineExecution?.executionStatus || '')) {
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

  return (
    <ExecutionContext.Provider value={{ currentTab, pipelineExecutionDetail: data?.data || null, pipelineStagesMap }}>
      <main className={css.main}>
        <div className={css.lhs}>
          <header className={cx(css.header, { [css.showDetails]: showDetail })}>
            <div className={css.breadcrumbs}>
              <Link to={routeCDDeployments.url({ orgIdentifier, projectIdentifier })}>Deployments</Link>
            </div>
            <div className={css.headerTopRow}>
              <div className={css.titleContainer}>
                <div className={css.title}>{data?.data?.pipelineExecution?.pipelineName}</div>
                {data?.data?.pipelineExecution?.executionStatus && (
                  <ExecutionStatusLabel status={data.data.pipelineExecution.executionStatus as ExecutionStatus} />
                )}
              </div>
              <div className={css.statusBar}>
                <Duration
                  startTime={data?.data?.pipelineExecution?.startedAt || TEMP_NOW} // TODO: remove Date.now() after complete API integration
                  // endTime={data?.data?.pipelineExecution?.endedAt}
                  durationText={' '}
                />
                <ExecutionActions executionStatus={data?.data?.pipelineExecution?.executionStatus} />
              </div>
            </div>
            <div className={css.headerBottomRow}>
              <Button
                className={css.toggleDetails}
                icon={showDetail ? 'chevron-up' : 'chevron-down'}
                small
                iconProps={{ size: 14 }}
                onClick={toggleDetails}
              />
            </div>
          </header>
          {showDetail ? <ExecutionMetadata /> : null}
          <ExecutionTabs key={currentTab} currentTab={currentTab} onTabChange={setCurrentTab}>
            <div className={css.viewStatus}>
              <div className={css.statusIcon}>
                <Icon name="warning-sign" size={20} intent="danger" />
              </div>
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
