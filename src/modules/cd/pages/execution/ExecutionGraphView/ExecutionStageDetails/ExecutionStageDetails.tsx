import React from 'react'

import ExecutionContext from 'modules/cd/pages/execution/ExecutionContext/ExecutionContext'
import {
  ExecutionPipeline,
  ExecutionPipelineNode,
  ExecutionPipelineNodeType
} from 'modules/common/components/ExecutionStageDiagram/ExecutionPipelineModel'
import type {
  ExecutionNode,
  ExecutionGraph,
  StageExecutionSummaryDTO,
  CDStageExecutionSummaryDTO
} from 'services/cd-ng'
import ExecutionStageDiagram from 'modules/common/components/ExecutionStageDiagram/ExecutionStageDiagram'

import css from './ExecutionStageDetails.module.scss'

export interface ExecutionStageDetailsProps {
  onStepSelect(step: string): void
  selectedStep: string
}

export enum StepTypes {
  SERVICE_STEP = 'SERVICE_STEP',
  SECTION_CHAIN = 'SECTION_CHAIN',
  ENVIRONMENT = 'ENVIRONMENT',
  ARTIFACT_FORK_STEP = 'ARTIFACT_FORK_STEP',
  MANIFEST_STEP = 'MANIFEST_STEP',
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  ARTIFACT_STEP = 'ARTIFACT_STEP',
  K8S_ROLLING = 'K8S_ROLLING'
}

const processNodeData = (
  children: string[],
  nodeMap: ExecutionGraph['nodeMap']
): Array<ExecutionPipelineNode<ExecutionNode>> => {
  const items: Array<ExecutionPipelineNode<ExecutionNode>> = []
  children?.forEach(item => {
    const nodeData = nodeMap?.[item]
    items.push({
      item: {
        name: nodeData?.name || '',
        icon: 'edit',
        identifier: item,
        status: nodeData?.status as any,
        type: ExecutionPipelineNodeType.NORMAL,
        data: nodeData
      }
    })
  })
  return items
}

const processExecutionData = (graph?: ExecutionGraph): Array<ExecutionPipelineNode<ExecutionNode>> => {
  const items: Array<ExecutionPipelineNode<ExecutionNode>> = []

  if (graph?.nodeAdjacencyListMap && graph?.rootNodeId) {
    const nodeAdjacencyListMap = graph.nodeAdjacencyListMap
    const rootNode = graph.rootNodeId
    let nodeId = nodeAdjacencyListMap[rootNode].children?.[0]
    while (nodeId && nodeAdjacencyListMap[nodeId]) {
      const nodeData = graph?.nodeMap?.[nodeId]
      if (nodeData) {
        if (nodeData.stepType === StepTypes.SECTION_CHAIN || nodeData.stepType === StepTypes.SERVICE_STEP) {
          items.push({
            group: {
              name: nodeData.name || '',
              identifier: nodeId,
              data: nodeData,
              status: nodeData.status as any,
              isOpen: true,
              icon: 'edit',
              items: processNodeData(nodeAdjacencyListMap[nodeId].children || [], graph?.nodeMap)
            }
          })
        } else {
          items.push({
            item: {
              name: nodeData.name || '',
              icon: 'edit',
              identifier: nodeId,
              status: nodeData.status as any,
              type: ExecutionPipelineNodeType.NORMAL,
              data: nodeData
            }
          })
        }
      }
      nodeId = nodeAdjacencyListMap[nodeId].next
    }
  }

  return items
}

const getStageFromSelectedStageId = (
  selectedStep?: string,
  stages?: StageExecutionSummaryDTO[]
): CDStageExecutionSummaryDTO | undefined => {
  let stage: CDStageExecutionSummaryDTO | undefined = undefined
  stages?.some(item => {
    if (item.parallel) {
      stage = getStageFromSelectedStageId(selectedStep, item.parallel.stageExecutions)
    } else {
      const cdStage = item.stage as CDStageExecutionSummaryDTO
      if (cdStage.stageIdentifier === selectedStep) {
        stage = cdStage
        return
      }
    }
  })
  return stage
}

export default function ExecutionStageDetails(props: ExecutionStageDetailsProps): React.ReactElement {
  const { pipelineExecutionDetail } = React.useContext(ExecutionContext)
  const stage = getStageFromSelectedStageId(
    props.selectedStep,
    pipelineExecutionDetail?.pipelineExecution?.stageExecutionSummaryElements
  )

  const data: ExecutionPipeline<ExecutionNode> = {
    items: processExecutionData(pipelineExecutionDetail?.stageGraph),
    identifier: props.selectedStep,
    status: stage?.executionStatus as any
  }

  return (
    <div className={css.main}>
      <ExecutionStageDiagram
        selectedIdentifier={props.selectedStep}
        itemClickHandler={e => props.onStepSelect(e.stage.identifier)}
        data={data}
        isWhiteBackground
        nodeStyle={{
          width: 64,
          height: 64
        }}
        gridStyle={{
          startX: 50,
          startY: 150
        }}
        canvasBtnsClass={css.canvasBtns}
      />
    </div>
  )
}
