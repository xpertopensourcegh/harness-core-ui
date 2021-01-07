import React from 'react'
import type { IconName } from '@wings-software/uicore'
import { isEmpty } from 'lodash-es'
import { useParams } from 'react-router-dom'
import type { ExecutionNode, ExecutionGraph } from 'services/pipeline-ng'
import type { ExecutionPathParams } from '@pipeline/utils/executionUtils'
import { useExecutionContext } from '@pipeline/pages/execution/ExecutionContext/ExecutionContext'
import {
  ExecutionLayoutState,
  useExecutionLayoutContext
} from '@pipeline/components/ExecutionLayout/ExecutionLayoutContext'
import ExecutionStageDiagram from '@pipeline/components/ExecutionStageDiagram/ExecutionStageDiagram'
import {
  ExecutionPipelineNode,
  ExecutionPipelineNodeType,
  ExecutionPipeline,
  StageOptions,
  ExecutionPipelineItem,
  ExecutionPipelineGroupInfo
} from '@pipeline/components/ExecutionStageDiagram/ExecutionPipelineModel'

import css from './ExecutionStageDetails.module.scss'

export const STATIC_SERVICE_GROUP_NAME = 'static_service_group'

// TODO: remove use DTO
export interface ServiceDependency {
  identifier: string
  name: string | null
  image: string
  status: string
  startTime: string
  endTime: string | null
  errorMessage: string | null
  errorReason: string | null
}

export interface ExecutionStageDetailsProps {
  onStepSelect(step?: string): void
  onStageSelect(step: string): void
  selectedStep: string
  selectedStage: string
}

export enum StepTypes {
  SERVICE = 'SERVICE',
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  GENERIC_SECTION = 'GENERIC_SECTION',
  SECTION_CHAIN = 'SECTION CHAIN',
  SECTION = 'SECTION',
  NG_SECTION = 'NG_SECTION',
  K8S_ROLLING = 'K8S_ROLLING',
  FORK = 'FORK',
  HTTP = 'HTTP'
}

const IconsMap: { [key in StepTypes]: IconName } = {
  SERVICE: 'main-services',
  GENERIC_SECTION: 'step-group',
  K8S_ROLLING: 'service-kubernetes',
  NG_SECTION: 'step-group',
  'SECTION CHAIN': 'step-group',
  SECTION: 'step-group',
  INFRASTRUCTURE: 'search-infra-prov',
  FORK: 'fork',
  HTTP: 'command-http'
}

const addDependencyToArray = (service: ServiceDependency, arr: ExecutionPipelineNode<ExecutionNode>[]): void => {
  const stepItem: ExecutionPipelineItem<ExecutionNode> = {
    identifier: service.identifier as string,
    name: service.name as string,
    type: ExecutionPipelineNodeType.NORMAL,
    status: service.status as any,
    icon: 'dependency-step',
    data: service as ExecutionNode,
    itemType: 'service-dependency'
  }

  // add step node
  const stepNode: ExecutionPipelineNode<ExecutionNode> = { item: stepItem }
  arr.push(stepNode)
}

const addDependencies = (
  dependencies: ServiceDependency[],
  stepsPipelineNodes: ExecutionPipelineNode<ExecutionNode>[]
): void => {
  if (dependencies && dependencies.length > 0) {
    const items: ExecutionPipelineNode<ExecutionNode>[] = []

    dependencies.forEach(_service => addDependencyToArray(_service, items))

    const dependenciesGroup: ExecutionPipelineGroupInfo<ExecutionNode> = {
      identifier: STATIC_SERVICE_GROUP_NAME,
      name: 'Dependencies', // TODO: use getString('execution.dependencyGroupName'),
      status: '' as any,
      data: {},
      icon: 'step-group',
      showLines: false,
      isOpen: true,
      items: [{ parallel: items }]
    }

    // dependency goes at the begining
    stepsPipelineNodes.unshift({ group: dependenciesGroup })
  }
}

const processNodeData = (
  children: string[],
  nodeMap: ExecutionGraph['nodeMap'],
  nodeAdjacencyListMap: ExecutionGraph['nodeAdjacencyListMap'],
  rootNodes: Array<ExecutionPipelineNode<ExecutionNode>>
): Array<ExecutionPipelineNode<ExecutionNode>> => {
  const items: Array<ExecutionPipelineNode<ExecutionNode>> = []
  children?.forEach(item => {
    const nodeData = nodeMap?.[item]
    if (nodeData?.stepType === StepTypes.FORK) {
      items.push({
        parallel: processNodeData(
          nodeAdjacencyListMap?.[item].children || /* istanbul ignore next */ [],
          nodeMap,
          nodeAdjacencyListMap,
          rootNodes
        )
      })
    } else if (nodeData?.stepType === StepTypes.SECTION_CHAIN || nodeData?.stepType === StepTypes.SECTION) {
      items.push({
        group: {
          name: nodeData.name || /* istanbul ignore next */ '',
          identifier: item,
          data: nodeData,
          showInLabel: false,
          status: nodeData.status as any,
          isOpen: true,
          icon: IconsMap[nodeData?.stepType as StepTypes] || 'cross',
          items: processNodeData(
            nodeAdjacencyListMap?.[item].children || /* istanbul ignore next */ [],
            nodeMap,
            nodeAdjacencyListMap,
            rootNodes
          )
        }
      })
    } else {
      if (nodeData?.stepType === 'LITE_ENGINE_TASK') {
        // NOTE: LITE_ENGINE_TASK contains information about dependencies
        const serviceDependencyList: ServiceDependency[] = ((nodeData as any)?.outcomes as any)?.find(
          (_item: any) => !!_item.serviceDependencyList
        )?.serviceDependencyList

        addDependencies(serviceDependencyList, rootNodes)
      } else {
        items.push({
          item: {
            name: nodeData?.name || /* istanbul ignore next */ '',
            icon: IconsMap[nodeData?.stepType as StepTypes] || 'cross',
            identifier: item,
            status: nodeData?.status as any,
            type: ExecutionPipelineNodeType.NORMAL,
            data: nodeData
          }
        })
      }
    }
    const nextIds = nodeAdjacencyListMap?.[item].nextIds || /* istanbul ignore next */ []
    nextIds.forEach(id => {
      const nodeDataNext = nodeMap?.[id]
      if (nodeDataNext?.stepType === StepTypes.FORK) {
        items.push({
          parallel: processNodeData(
            nodeAdjacencyListMap?.[id].children || /* istanbul ignore next */ [],
            nodeMap,
            nodeAdjacencyListMap,
            rootNodes
          )
        })
      } else {
        items.push({
          item: {
            name: nodeDataNext?.name || /* istanbul ignore next */ '',
            icon: IconsMap[nodeData?.stepType as StepTypes] || 'cross',
            identifier: id,
            status: nodeDataNext?.status as any,
            type: ExecutionPipelineNodeType.NORMAL,
            data: nodeDataNext
          }
        })
      }
      const nextLevels = nodeAdjacencyListMap?.[id].nextIds
      if (nextLevels) {
        items.push(...processNodeData(nextLevels, nodeMap, nodeAdjacencyListMap, rootNodes))
      }
    })
  })
  return items
}

const processExecutionData = (graph?: ExecutionGraph): Array<ExecutionPipelineNode<ExecutionNode>> => {
  const items: Array<ExecutionPipelineNode<ExecutionNode>> = []

  /* istanbul ignore else */
  if (graph?.nodeAdjacencyListMap && graph?.rootNodeId) {
    const nodeAdjacencyListMap = graph.nodeAdjacencyListMap
    const rootNode = graph.rootNodeId
    let nodeId = nodeAdjacencyListMap[rootNode].children?.[0]
    while (nodeId && nodeAdjacencyListMap[nodeId]) {
      const nodeData = graph?.nodeMap?.[nodeId]
      /* istanbul ignore else */
      if (nodeData) {
        if (nodeData.stepType === StepTypes.NG_SECTION) {
          items.push({
            group: {
              name: nodeData.name || /* istanbul ignore next */ '',
              identifier: nodeId,
              data: nodeData,
              status: nodeData.status as any,
              isOpen: true,
              icon: IconsMap[nodeData?.stepType as StepTypes] || 'cross',
              items: processNodeData(
                nodeAdjacencyListMap[nodeId].children || /* istanbul ignore next */ [],
                graph?.nodeMap,
                graph?.nodeAdjacencyListMap,
                items
              )
            }
          })
        } else if (nodeData.stepType === StepTypes.FORK) {
          items.push({
            parallel: processNodeData(
              nodeAdjacencyListMap[nodeId].children || /* istanbul ignore next */ [],
              graph?.nodeMap,
              graph?.nodeAdjacencyListMap,
              items
            )
          })
        } else {
          items.push({
            item: {
              name: nodeData.name || /* istanbul ignore next */ '',
              icon: IconsMap[nodeData?.stepType as StepTypes] || 'cross',
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
  const { pipelineExecutionDetail, pipelineStagesMap, queryParams, loading } = useExecutionContext()
  const { layout, setLayout } = useExecutionLayoutContext()

  const stagesOptions: StageOptions[] = [...pipelineStagesMap].map(item => ({
    label: item[1].nodeType || /* istanbul ignore next */ '',
    value: item[1].nodeUuid || /* istanbul ignore next */ '',
    icon: { name: 'pipeline-deploy' },
    disabled: item[1].status === 'NotStarted'
  }))
  const { executionIdentifier } = useParams<ExecutionPathParams>()
  const stage = pipelineStagesMap.get(props.selectedStage)

  const data: ExecutionPipeline<ExecutionNode> = {
    items: processExecutionData(pipelineExecutionDetail?.executionGraph),
    identifier: `${executionIdentifier}-${props.selectedStage}`,
    status: stage?.status as any
  }

  // open details view when a user selection is active
  React.useEffect(() => {
    if (queryParams.step && layout === ExecutionLayoutState.NONE) {
      setLayout(ExecutionLayoutState.RIGHT)
    } else if (!queryParams.step && layout !== ExecutionLayoutState.NONE) {
      setLayout(ExecutionLayoutState.NONE)
    }
  }, [queryParams, layout, setLayout])
  return (
    <div
      className={css.main}
      onClick={() => {
        props.onStepSelect()
      }}
    >
      {!isEmpty(props.selectedStage) && data.items?.length > 0 && (
        <ExecutionStageDiagram
          selectedIdentifier={props.selectedStep}
          itemClickHandler={e => props.onStepSelect(e.stage.identifier)}
          data={data}
          showEndNode={stage?.status !== 'Running'}
          isWhiteBackground
          nodeStyle={{
            width: 64,
            height: 64
          }}
          loading={loading}
          gridStyle={{
            startX: 50,
            startY: 150
          }}
          showStageSelection={true}
          selectedStage={{
            label: stage?.nodeType || /* istanbul ignore next */ '',
            value: stage?.nodeUuid || /* istanbul ignore next */ '',
            icon: { name: 'pipeline-deploy' }
          }}
          stageSelectionOptions={stagesOptions}
          onChangeStageSelection={(item: StageOptions) => {
            props.onStageSelect(item.value as string)
          }}
          canvasBtnsClass={css.canvasBtns}
        />
      )}
    </div>
  )
}
