import type { SelectOption } from '@wings-software/uikit'
import type {
  ExecutionPipeline,
  ExecutionPipelineNode
} from 'modules/common/components/ExecutionStageDiagram/ExecutionPipelineModel'

/**
 * Get flat list of SelectOption form pipeline
 */
export function getSelectOptionsFromExecutionPipeline<T>(pipeline: ExecutionPipeline<T>): SelectOption[] {
  const options: SelectOption[] = []
  populateSelectOptionsFromStages<T>(options, pipeline.items)
  return options
}

function populateSelectOptionsFromStages<T>(options: SelectOption[], stages: ExecutionPipelineNode<T>[]): void {
  stages.forEach((node: ExecutionPipelineNode<T>) => {
    if (node.item) {
      options.push({ label: node.item.name, value: node.item.identifier, icon: { name: node.item.icon } })
    }
    if (node.parallel) {
      populateSelectOptionsFromStages(options, node.parallel)
    }
  })
}
