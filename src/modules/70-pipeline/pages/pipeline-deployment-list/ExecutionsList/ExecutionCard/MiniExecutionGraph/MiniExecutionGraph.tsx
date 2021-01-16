import React from 'react'
import { IconName, Icon } from '@wings-software/uicore'
import cx from 'classnames'
import { startCase, sortBy } from 'lodash-es'

import { Tooltip, ITooltipProps } from '@blueprintjs/core'
import type { GraphLayoutNode, PipelineExecutionSummary } from 'services/pipeline-ng'
import type { ExecutionStatus } from '@pipeline/utils/statusHelpers'
import { isExecutionRunning, isExecutionCompletedWithBadState } from '@pipeline/utils/statusHelpers'

import { processLayoutNodeMap } from '@pipeline/utils/executionUtils'
import css from './MiniExecutionGraph.module.scss'

const IconMap: Record<ExecutionStatus, IconName> = {
  Success: 'tick-circle',
  Running: 'main-more',
  Failed: 'circle-cross',
  Expired: 'expired',
  Aborted: 'banned',
  Suspended: 'banned',
  Queued: 'queued',
  NotStarted: 'pending',
  Paused: 'pause',
  Waiting: 'waiting',
  Skipped: 'skipped'
}

// Higher the number, Higher the Priority, Max 100.
const StagePriority: Record<ExecutionStatus, number> = {
  Success: 1,
  Running: 2,
  Failed: 20,
  Expired: 18,
  Aborted: 19,
  Suspended: 17,
  Queued: 0,
  NotStarted: 0,
  Paused: 24,
  Waiting: 25,
  Skipped: 15
}

function RunningIcon(): React.ReactElement {
  return (
    <div className={css.runningAnimation}>
      <div />
      <div />
      <div />
    </div>
  )
}

export interface StageNodeProps extends Omit<ITooltipProps, 'content'> {
  stage: GraphLayoutNode
  onMouseEnter?(): void
}

export function StageNode({ stage, onMouseEnter, ...rest }: StageNodeProps): React.ReactElement {
  const statusLower = stage.status?.toLowerCase() || ''

  return (
    <Tooltip
      position="top"
      {...rest}
      content={startCase(stage.status)}
      className={cx(css.stageWrapper, css[statusLower as keyof typeof css])}
      targetClassName={css.stage}
      targetProps={{ onMouseEnter }}
      targetTagName="div"
      wrapperTagName="div"
    >
      {stage.status === 'Running' ? (
        <RunningIcon />
      ) : (
        <Icon name={IconMap[stage.status as ExecutionStatus]} size={13} className={css.icon} />
      )}
    </Tooltip>
  )
}

export interface ParallelNodeProps {
  stages: GraphLayoutNode[]
}

const STEP_DETAILS_LIMIT = 4

export function ParallelStageNode(props: ParallelNodeProps): React.ReactElement {
  const [showDetails, setShowDetails] = React.useState(false)
  const { stages } = props
  const sortedStages = sortBy(stages, stage => 100 - StagePriority[stage.status as ExecutionStatus])

  function handleMouseEnter(): void {
    setShowDetails(true)
  }

  function handleMouseLeave(): void {
    setShowDetails(false)
  }

  return (
    <div className={cx(css.parallelNodes, { [css.showDetails]: showDetails })} onMouseLeave={handleMouseLeave}>
      <div className={css.moreStages}>
        {sortedStages.slice(1, STEP_DETAILS_LIMIT).map((stage: GraphLayoutNode, i) => (
          <StageNode key={i} stage={stage} />
        ))}
        {sortedStages.length > STEP_DETAILS_LIMIT ? (
          <div className={css.extraCount}>+ {stages.length - STEP_DETAILS_LIMIT}</div>
        ) : null}
      </div>
      <div className={css.ghostNodes} data-stages={Math.min(stages.length - 1, 2)} />
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
            <RunningIcon />
            {runningStagesCount}
          </div>
        ) : isExecutionCompletedWithBadState(status) ? (
          <div className={css.stepCount} data-status="failed">
            <Icon name={IconMap.Failed} size={10} /> {failedStagesCount}
          </div>
        ) : null}
        {isExecutionCompletedWithBadState(status) && executionErrorInfo?.message ? (
          <Tooltip content={executionErrorInfo.message}>
            <div className={cx(css.stepCount, css.errorMsg)}>{executionErrorInfo.message}</div>
          </Tooltip>
        ) : null}
      </div>
    </div>
  )
}
