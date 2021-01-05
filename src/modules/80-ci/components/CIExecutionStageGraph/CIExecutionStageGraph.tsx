import React, { useCallback } from 'react'
import { first } from 'lodash-es'
import { Color } from '@wings-software/uicore'
import { ExecutionStageGraph, RenderStageButtonInfo } from '@ci/components/ExecutionStageGraph/ExecutionStageGraph'
import { ExecutionPipeline, ExecutionPipelineItemStatus, ExecutionPipelineNode } from '@pipeline/exports'
import { getStagesStatusesCounter } from '@ci/pages/build/utils/api2ui'
import type { ItemData } from '@ci/pages/build/context/BuildPageContext'

interface CIExecutionStageGraphProps {
  pipeline: ExecutionPipeline<ItemData>
}

export const CIExecutionStageGraph: React.FC<CIExecutionStageGraphProps> = props => {
  const { pipeline } = props

  const renderStageButton = useCallback((node: ExecutionPipelineNode<ItemData>): RenderStageButtonInfo => {
    const parallel = !!node.parallel
    const checkStatus = (_status: ExecutionPipelineItemStatus): boolean =>
      !parallel ? node?.item?.status === _status : !!node?.parallel?.find(pNode => pNode.item?.status === _status)

    const success =
      checkStatus(ExecutionPipelineItemStatus.SUCCESS) || checkStatus(ExecutionPipelineItemStatus.SUCCEEDED)
    const failed =
      !success &&
      (checkStatus(ExecutionPipelineItemStatus.FAILED) ||
        checkStatus(ExecutionPipelineItemStatus.ABORTED) ||
        checkStatus(ExecutionPipelineItemStatus.ERROR) ||
        checkStatus(ExecutionPipelineItemStatus.REJECTED))
    const running =
      !success &&
      !failed &&
      (checkStatus(ExecutionPipelineItemStatus.RUNNING) ||
        checkStatus(ExecutionPipelineItemStatus.PAUSED) ||
        checkStatus(ExecutionPipelineItemStatus.PAUSING) ||
        checkStatus(ExecutionPipelineItemStatus.WAITING) ||
        checkStatus(ExecutionPipelineItemStatus.ABORTING))

    return {
      key: (parallel ? first(node.parallel)?.item?.identifier : node.item?.identifier) as string,
      icon: success ? 'tick-circle' : failed ? 'warning-sign' : running ? 'spinner' : 'pending',
      color: failed ? Color.RED_500 : success ? Color.BLUE_500 : running ? Color.GREEN_500 : Color.GREY_300,
      parallel,
      tooltip: undefined // TODO: disable tooltip since no tooltip design is finalized
    }
  }, [])

  return (
    <ExecutionStageGraph
      stages={pipeline?.items || []}
      stageStatusCounts={getStagesStatusesCounter(pipeline?.items || [])}
      renderStageButton={renderStageButton}
      errorMsg={undefined /*TODO*/}
    />
  )
}
