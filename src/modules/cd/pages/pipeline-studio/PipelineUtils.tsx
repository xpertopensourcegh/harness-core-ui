import React from 'react'
import type { ITreeNode } from '@blueprintjs/core'
import { Text, Color } from '@wings-software/uikit'
import type { CDPipeline, StageElement, StageElementWrapper } from 'services/cd-ng'
import i18n from './PipelineStudio.i18n'

const getStageTree = (stage: StageElement): ITreeNode => {
  const stageNode: ITreeNode = {
    id: `Stage${stage.identifier}`,
    hasCaret: true,
    label: (
      <Text color={Color.BLACK} width="147" lineClamp={1}>
        {stage.name}
      </Text>
    ),
    childNodes: []
  }
  stageNode.childNodes?.push(
    {
      id: `Stage_Custom_Variables$${stage.identifier}`,
      hasCaret: false,
      label: <Text>{i18n.customVariables}</Text>
    },
    {
      id: `Stage_Service$${stage.identifier}`,
      hasCaret: false,
      label: <Text>{i18n.service}</Text>
    },
    {
      id: `Stage_Infrastructure$${stage.identifier}`,
      hasCaret: false,
      label: <Text>{i18n.infrastructure}</Text>
    },
    {
      id: `Stage_Execution$${stage.identifier}`,
      hasCaret: false,
      label: <Text>{i18n.execution}</Text>
    }
  )
  return stageNode
}

export const getPipelineTree = (pipeline: CDPipeline): ITreeNode[] => {
  const returnNodes: ITreeNode[] = [
    {
      id: 'Pipeline_Variables',
      hasCaret: false,
      isSelected: true,
      label: <Text color={Color.BLACK}>{i18n.pipelineVariables}</Text>
    },
    {
      id: 'Pipeline_Custom_Variables',
      hasCaret: false,
      label: <Text color={Color.BLACK}>{i18n.customVariables}</Text>
    }
  ]

  if (pipeline.stages && pipeline.stages?.length > 0) {
    const stages: ITreeNode = {
      id: 'Stages',
      hasCaret: true,
      isExpanded: true,
      label: <Text color={Color.BLACK}>{i18n.stages}</Text>,
      childNodes: []
    }
    pipeline.stages.forEach(data => {
      if (data.parallel && data.parallel.length > 0) {
        data.parallel.forEach((nodeP: StageElementWrapper) => {
          nodeP.stage && stages.childNodes?.push(getStageTree(nodeP.stage))
        })
      } else if (data.stage) {
        stages.childNodes?.push(getStageTree(data.stage))
      }
    })
    returnNodes.push(stages)
  }
  return returnNodes
}
