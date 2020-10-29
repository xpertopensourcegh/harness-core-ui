import React from 'react'

import { useExecutionLayoutContext, ExecutionStageDiagram } from '@pipeline/exports'
import { ExecutionPipeline, ExecutionPipelineNode, ExecutionPipelineNodeType } from '@pipeline/exports'
import type { CDStageExecutionSummaryDTO, StageExecutionSummaryDTO } from 'services/cd-ng'
import { useExecutionContext } from '../../../ExecutionContext/ExecutionContext'
import css from './ExecutionGraph.module.scss'

const processExecutionData = (
  stages?: StageExecutionSummaryDTO[]
): Array<ExecutionPipelineNode<CDStageExecutionSummaryDTO>> => {
  const items: Array<ExecutionPipelineNode<CDStageExecutionSummaryDTO>> = []
  stages?.forEach(item => {
    if (item.parallel) {
      items.push({ parallel: processExecutionData(item.parallel.stageExecutions) })
    } else {
      const cdStage = item.stage as CDStageExecutionSummaryDTO
      items.push({
        item: {
          icon: 'pipeline-deploy',
          identifier: cdStage.stageIdentifier || /* istanbul ignore next */ '',
          name: cdStage.stageName || /* istanbul ignore next */ '',
          status: cdStage.executionStatus as any,
          type: ExecutionPipelineNodeType.NORMAL,
          data: cdStage
        }
      })
    }
  })
  return items
}

export interface ExecutionGraphProps {
  selectedStage: string
  onSelectedStage(stage: string): void
}

export default function ExecutionGraph(props: ExecutionGraphProps): React.ReactElement {
  const { pipelineExecutionDetail } = useExecutionContext()
  const { primaryPaneSize } = useExecutionLayoutContext()

  const data: ExecutionPipeline<CDStageExecutionSummaryDTO> = {
    items: processExecutionData(pipelineExecutionDetail?.pipelineExecution?.stageExecutionSummaryElements),
    identifier: pipelineExecutionDetail?.pipelineExecution?.pipelineIdentifier || /* istanbul ignore next */ '',
    status: pipelineExecutionDetail?.pipelineExecution?.executionStatus as any
  }
  return (
    <div className={css.main}>
      <ExecutionStageDiagram
        selectedIdentifier={props.selectedStage}
        itemClickHandler={e => props.onSelectedStage(e.stage.identifier)}
        diagramContainerHeight={primaryPaneSize}
        data={data}
        nodeStyle={{
          width: 114,
          height: 50
        }}
        gridStyle={{
          startX: 50,
          startY: 50
        }}
      />
    </div>
  )
}
