import React from 'react'
import { IconName, Icon } from '@wings-software/uikit'
import cx from 'classnames'

import type { GraphLayoutNode, PipelineExecutionSummary } from 'services/pipeline-ng'
import type { ExecutionStatus } from '@pipeline/utils/statusHelpers'
import { isExecutionRunning, isExecutionCompletedWithBadState } from '@pipeline/utils/statusHelpers'

import { processLayoutNodeMap } from '@pipeline/utils/executionUtils'
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
  stage: GraphLayoutNode
}

export function StageNode({ stage, ...rest }: StageNodeProps): React.ReactElement {
  return (
    <div {...rest} className={css.stage} data-status={stage.status?.toLowerCase()}>
      <Icon name={IconMap[stage.status as ExecutionStatus]} size={13} className={css.icon} />
    </div>
  )
}

export interface ParallelNodeProps {
  stages: GraphLayoutNode[]
}

const STEP_DETAILS_LIMIT = 4

export function ParallelStageNode(props: ParallelNodeProps): React.ReactElement {
  const [showDetails, setShowDetails] = React.useState(false)
  const { stages } = props
  const sortedStages = stages.slice(0)
  function handleMouseEnter(): void {
    setShowDetails(true)
  }

  function handleMouseLeave(): void {
    setShowDetails(false)
  }

  return (
    <div className={cx(css.parallel, { [css.showDetails]: showDetails })} onMouseLeave={handleMouseLeave}>
      <div className={css.moreStages}>
        {stages.slice(1, STEP_DETAILS_LIMIT).map((stage: GraphLayoutNode, i) => (
          <StageNode key={i} stage={stage} />
        ))}
        {stages.length > STEP_DETAILS_LIMIT ? (
          <div className={css.extraCount}>+ {stages.length - STEP_DETAILS_LIMIT}</div>
        ) : null}
      </div>
      <div className={css.parallelNodes} data-stages={Math.min(stages.length - 1, 2)} />
      <StageNode stage={sortedStages[0]} onMouseEnter={handleMouseEnter} />
    </div>
  )
}

export interface MiniExecutionGraphProps {
  pipelineExecution: PipelineExecutionSummary
}

export default function MiniExecutionGraph(props: MiniExecutionGraphProps): React.ReactElement {
  const {
    successfulStagesCount,
    runningStagesCount,
    failedStagesCount,
    status,
    totalStagesCount,
    executionErrorInfo
  } = props.pipelineExecution
  const elements = processLayoutNodeMap(props.pipelineExecution)
  return (
    <div className={css.main}>
      <div className={css.graphWrapper}>
        <div className={css.graph}>
          {(elements || []).map(({ stage, parallel }, i) => {
            if (parallel && Array.isArray(parallel)) {
              return <ParallelStageNode key={i} stages={parallel} />
            }

            if (stage) {
              return <StageNode key={stage.nodeUuid} stage={stage} />
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
        {isExecutionRunning(status) ? (
          <div className={css.stepCount} data-status="running">
            <Icon name={IconMap.Running} size={10} />
            {runningStagesCount}
          </div>
        ) : isExecutionCompletedWithBadState(status) ? (
          <div className={css.stepCount} data-status="failed">
            <Icon name={IconMap.Failed} size={10} /> {failedStagesCount}
          </div>
        ) : null}
        {isExecutionCompletedWithBadState(status) && executionErrorInfo?.message ? (
          <div className={cx(css.stepCount, css.errorMsg)}>{executionErrorInfo.message}</div>
        ) : null}
      </div>
    </div>
  )
}
