import React from 'react'
import { IconName, Icon } from '@wings-software/uikit'
import cx from 'classnames'

import type { PipelineExecutionSummaryDTO } from 'services/cd-ng'
import type { ExecutionStatus } from '@pipeline/utils/statusHelpers'
import { isExecutionRunning, isExecutionCompletedWithBadState } from '@pipeline/utils/statusHelpers'

import css from './MiniExecutionGraph.module.scss'

// TODO: Update icon map with correct icons
const IconMap: Record<ExecutionStatus, IconName> = {
  Success: 'tick-circle',
  Running: 'dot',
  Failed: 'error',
  Expired: 'error',
  Aborted: 'error',
  Suspended: 'error',
  Queued: 'spinner',
  NotStarted: 'spinner',
  Paused: 'spinner',
  Waiting: 'spinner'
}

export interface StageNodeProps extends React.HTMLAttributes<HTMLDivElement> {
  stage: any
}

export function StageNode({ stage, ...rest }: StageNodeProps): React.ReactElement {
  return (
    <div {...rest} className={css.stage} data-status={stage.executionStatus?.toLowerCase()}>
      <Icon name={IconMap[stage.executionStatus as ExecutionStatus]} size={13} className={css.icon} />
    </div>
  )
}

export interface ParallelNodeProps {
  stages: any[]
}

const STEP_DETAILS_LIMIT = 4

export function ParallelStageNode(props: ParallelNodeProps): React.ReactElement {
  const [showDetails, setShowDetails] = React.useState(false)
  const sortedStages = props.stages.slice(0)
  const detailSteps: ExecutionStatus[] = sortedStages.map(({ stage }) => stage.executionStatus)

  function handleMouseEnter(): void {
    setShowDetails(true)
  }

  function handleMouseLeave(): void {
    setShowDetails(false)
  }

  return (
    <div className={cx(css.parallel, { [css.showDetails]: showDetails })} onMouseLeave={handleMouseLeave}>
      <div className={css.moreStages}>
        {detailSteps.slice(1, STEP_DETAILS_LIMIT).map((stepStatus, i) => (
          <StageNode key={i} stage={{ executionStatus: stepStatus }} />
        ))}
        {detailSteps.length > STEP_DETAILS_LIMIT ? (
          <div className={css.extraCount}>+ {detailSteps.length - STEP_DETAILS_LIMIT}</div>
        ) : null}
      </div>
      <div className={css.parallelNodes} data-stages={Math.min(detailSteps.length - 1, 2)} />
      <StageNode stage={{ executionStatus: sortedStages[0]?.stage?.executionStatus }} onMouseEnter={handleMouseEnter} />
    </div>
  )
}

export interface MiniExecutionGraphProps {
  pipelineExecution: PipelineExecutionSummaryDTO
}

export default function MiniExecutionGraph(props: MiniExecutionGraphProps): React.ReactElement {
  const {
    stageExecutionSummaryElements,
    successfulStagesCount,
    runningStagesCount,
    failedStagesCount,
    executionStatus,
    totalStagesCount,
    errorMsg
  } = props.pipelineExecution

  return (
    <div className={css.main}>
      <div className={css.graphWrapper}>
        <div className={css.graph}>
          {(stageExecutionSummaryElements || []).map(({ stage, parallel }, i) => {
            if (parallel && Array.isArray(parallel.stageExecutions)) {
              return <ParallelStageNode key={i} stages={parallel.stageExecutions} />
            }

            if (stage) {
              return <StageNode key={stage.stageIdentifier} stage={stage} />
            }

            return null
          })}
        </div>
      </div>
      <div className={css.stepCounts}>
        <div className={css.stepCount} data-status="success">
          <Icon name={IconMap.Success} size={10} />
          {successfulStagesCount} / {totalStagesCount}
        </div>
        {isExecutionRunning(executionStatus) ? (
          <div className={css.stepCount} data-status="running">
            <Icon name={IconMap.Running} size={10} />
            {runningStagesCount}
          </div>
        ) : isExecutionCompletedWithBadState(executionStatus) ? (
          <div className={css.stepCount} data-status="failed">
            <Icon name={IconMap.Failed} size={10} /> {failedStagesCount}
          </div>
        ) : null}
        {isExecutionCompletedWithBadState(executionStatus) && errorMsg ? (
          <div className={cx(css.stepCount, css.errorMsg)}>{errorMsg}</div>
        ) : null}
      </div>
    </div>
  )
}
