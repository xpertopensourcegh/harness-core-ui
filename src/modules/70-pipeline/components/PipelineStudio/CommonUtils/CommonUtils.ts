import type { SelectOption } from '@wings-software/uicore'
import type { NgPipeline, StageElementWrapper } from 'services/cd-ng'
import { EmptyStageName } from '../PipelineConstants'

export interface StageSelectOption extends SelectOption {
  node: StageElementWrapper
  type: string
}

export function getSelectStageOptionsFromPipeline(pipeline: NgPipeline): StageSelectOption[] {
  return getStagesFromPipeline(pipeline).map(node => ({
    label: node.stage.name,
    value: node.stage.identifier,
    node: node,
    type: node.stage.type
  }))
}

export function getStagesFromPipeline(pipeline: NgPipeline): StageElementWrapper[] {
  const stages: StageElementWrapper[] = []
  if (pipeline.stages) {
    pipeline.stages.forEach((node: StageElementWrapper) => {
      if (node.stage && node.stage.name !== EmptyStageName) {
        stages.push(node)
      } else if (node.parallel) {
        node.parallel.forEach((parallelNode: StageElementWrapper) => {
          if (parallelNode.stage && parallelNode.stage.name !== EmptyStageName) {
            stages.push(parallelNode)
          }
        })
      }
    })
  }
  return stages
}
