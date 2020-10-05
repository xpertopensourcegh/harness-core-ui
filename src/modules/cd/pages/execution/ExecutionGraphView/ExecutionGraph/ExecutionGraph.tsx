import React from 'react'
import ExecutionContext from 'modules/cd/pages/execution/ExecutionContext/ExecutionContext'
import {
  ExecutionPipeline,
  ExecutionPipelineNode,
  ExecutionPipelineNodeType
} from 'modules/common/components/ExecutionStageDiagram/ExecutionPipelineModel'
import type { CDStageExecutionSummaryDTO, StageExecutionSummaryDTO } from 'services/cd-ng'
import ExecutionStageDiagram from 'modules/common/components/ExecutionStageDiagram/ExecutionStageDiagram'
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
          identifier: cdStage.stageIdentifier || '',
          name: cdStage.stageName || '',
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
  graphSize: number
}

export default function ExecutionGraph(props: ExecutionGraphProps): React.ReactElement {
  const { pipelineExecutionDetail } = React.useContext(ExecutionContext)
  const data: ExecutionPipeline<CDStageExecutionSummaryDTO> = {
    items: processExecutionData(pipelineExecutionDetail?.pipelineExecution?.stageExecutionSummaryElements),
    identifier: pipelineExecutionDetail?.pipelineExecution?.pipelineIdentifier || '',
    status: pipelineExecutionDetail?.pipelineExecution?.executionStatus as any
  }
  return (
    <div className={css.main}>
      <ExecutionStageDiagram
        selectedIdentifier={props.selectedStage}
        itemClickHandler={e => {
          props.onSelectedStage(e.stage.identifier)
        }}
        diagramContainerHeight={props.graphSize}
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
