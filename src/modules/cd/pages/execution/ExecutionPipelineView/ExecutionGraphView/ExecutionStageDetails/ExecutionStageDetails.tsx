import React from 'react'

import { useExecutionContext } from 'modules/cd/pages/execution/ExecutionContext/ExecutionContext'
import {
  ExecutionPipeline,
  ExecutionPipelineNode,
  ExecutionPipelineNodeType,
  StageOptions
} from 'modules/common/components/ExecutionStageDiagram/ExecutionPipelineModel'
import type { ExecutionNode, ExecutionGraph } from 'services/cd-ng'
import ExecutionStageDiagram from 'modules/common/components/ExecutionStageDiagram/ExecutionStageDiagram'
import {
  useExecutionLayoutContext,
  ExecutionLayoutState
} from 'modules/common/components/ExecutionLayout/ExecutionLayoutContext'

import css from './ExecutionStageDetails.module.scss'

export interface ExecutionStageDetailsProps {
  onStepSelect(step: string): void
  onStageSelect(step: string): void
  selectedStep: string
  selectedStage: string
}

export enum StepTypes {
  SERVICE = 'SERVICE',
  GENERIC_SECTION = 'GENERIC_SECTION',
  ENVIRONMENT = 'ENVIRONMENT',
  ARTIFACT_FORK_STEP = 'ARTIFACT_FORK_STEP',
  MANIFEST_STEP = 'MANIFEST_STEP',
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  ARTIFACT_STEP = 'ARTIFACT_STEP',
  K8S_ROLLING = 'K8S_ROLLING'
}

const processNodeData = (
  children: string[],
  nodeMap: ExecutionGraph['nodeMap'],
  nodeAdjacencyListMap: ExecutionGraph['nodeAdjacencyListMap']
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
    const nextIds = nodeAdjacencyListMap?.[item].nextIds || []
    nextIds.forEach(id => {
      const nodeDataNext = nodeMap?.[id]
      items.push({
        item: {
          name: nodeDataNext?.name || '',
          icon: 'edit',
          identifier: id,
          status: nodeDataNext?.status as any,
          type: ExecutionPipelineNodeType.NORMAL,
          data: nodeDataNext
        }
      })
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
        if (nodeData.stepType === StepTypes.GENERIC_SECTION) {
          items.push({
            group: {
              name: nodeData.name || '',
              identifier: nodeId,
              data: nodeData,
              status: nodeData.status as any,
              isOpen: true,
              icon: 'edit',
              items: processNodeData(
                nodeAdjacencyListMap[nodeId].children || [],
                graph?.nodeMap,
                graph?.nodeAdjacencyListMap
              )
            }
          })
        } else {
          items.push({
            item: {
              name: nodeData.name || '',
              icon: 'edit',
              showInLabel: nodeData.stepType === StepTypes.SERVICE || nodeData.stepType === StepTypes.INFRASTRUCTURE,
              identifier: nodeId,
              status: nodeData.status as any,
              type: ExecutionPipelineNodeType.NORMAL,
              data: nodeData
            }
          })
        }
      }
      nodeId = nodeAdjacencyListMap[nodeId].nextIds?.[0]
    }
  }

  return items
}

export default function ExecutionStageDetails(props: ExecutionStageDetailsProps): React.ReactElement {
  const { pipelineExecutionDetail, pipelineStagesMap, queryParams } = useExecutionContext()
  const { layout, setLayout } = useExecutionLayoutContext()

  const stagesOptions: StageOptions[] = [...pipelineStagesMap].map(item => ({
    label: item[1].stageName || '',
    value: item[1].stageIdentifier || '',
    icon: { name: 'pipeline-deploy' },
    disabled: item[1].executionStatus === 'NotStarted'
  }))
  const stage = pipelineStagesMap.get(props.selectedStage)

  const data: ExecutionPipeline<ExecutionNode> = {
    items: processExecutionData(pipelineExecutionDetail?.stageGraph),
    identifier: props.selectedStep,
    status: stage?.executionStatus as any
  }

  // open details view when a user selection is active
  React.useEffect(() => {
    if (queryParams.step && layout === ExecutionLayoutState.NONE) {
      setLayout(ExecutionLayoutState.RIGHT)
    }
  }, [queryParams, layout, setLayout])

  return (
    <div className={css.main}>
      <ExecutionStageDiagram
        key={props.selectedStage}
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
        showStageSelection={true}
        selectedStage={{
          label: stage?.stageName || '',
          value: stage?.stageIdentifier || '',
          icon: { name: 'pipeline-deploy' }
        }}
        stageSelectionOptions={stagesOptions}
        onChangeStageSelection={(item: StageOptions) => {
          props.onStageSelect(item.value as string)
        }}
        canvasBtnsClass={css.canvasBtns}
      />
    </div>
  )
}
