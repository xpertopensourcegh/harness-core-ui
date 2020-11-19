import type { SelectOption } from '@wings-software/uikit'
import type { ExecutionPipelineItem } from '@pipeline/exports'
import type { ExecutionPipeline, ExecutionPipelineNode } from '@pipeline/exports'

export function getStepsPipelineFromExecutionPipeline<T>(
  pipeline: ExecutionPipeline<T> | undefined,
  selectedStageIdentifier = '-1'
): ExecutionPipeline<T> {
  if (!pipeline || selectedStageIdentifier === '-1') return { items: [], identifier: '' }

  // TODO: iterate thoughts parallel stages
  return (
    pipeline.items.find(node => node.item?.identifier === selectedStageIdentifier)?.item?.pipeline || {
      items: [],
      identifier: ''
    }
  )
}

function addItemsArray<T>(nodes: ExecutionPipelineNode<T>[], steps: ExecutionPipelineItem<T>[]) {
  nodes.forEach(node => {
    if (node.parallel) {
      addItemsArray(node.parallel, steps)
    }
    if (node.group) {
      addItemsArray(node.group.items, steps)
    } else {
      if (node.item) {
        steps.push(node.item)
      }
    }
  })
}

export function getFlattenItemsFromPipeline<T>(pipeline: ExecutionPipeline<T>) {
  const steps: ExecutionPipelineItem<T>[] = []
  addItemsArray(pipeline.items, steps)
  return steps
}

export function getItemFromPipeline<T>(
  pipeline: ExecutionPipeline<T>,
  identifier = '-1'
): ExecutionPipelineItem<T> | undefined {
  if (!pipeline || identifier === '-1') return undefined

  const arr = getFlattenItemsFromPipeline(pipeline)

  const retItem = arr.find(item => item.identifier === identifier)
  return retItem
}

/**
 * Get flat list of SelectOption form pipeline
 */
export function getSelectOptionsFromExecutionPipeline<T>(pipeline: ExecutionPipeline<T> | undefined): SelectOption[] {
  if (!pipeline) return []

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
