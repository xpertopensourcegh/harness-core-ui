import type { NodeModelListener, LinkModelListener } from '@projectstorm/react-diagrams-core'
import type { BaseModelListener, BaseModel } from '@projectstorm/react-canvas-core'
import { v4 as nameSpace, v5 as uuid, version } from 'uuid'
import type { ExecutionWrapper, ExecutionElement } from 'services/cd-ng'
import { Diagram } from 'modules/common/exports'
import { EmptyNodeSeparator } from '../StageBuilder/StageBuilderUtil'

export interface ExecutionGraphState {
  isRollback: boolean
  stepStates: StepStateMap
  data: Required<ExecutionElement>
}

export type ExecutionParallelWrapper = ExecutionWrapper & {
  parallel: ExecutionWrapper[]
}

export interface Listeners {
  nodeListeners: NodeModelListener
  linkListeners: LinkModelListener
  layerListeners: BaseModelListener
}

export const generateRandomString = (name: string): string => uuid(name, nameSpace())

export const isCustomGeneratedString = (name: string): boolean => {
  try {
    return version(name) === 5
  } catch (_e) {
    return false
  }
}

export interface StepState {
  isRollback?: boolean
  isStepGroupRollback?: boolean
  isStepGroupCollapsed?: boolean
  isStepGroup?: boolean
  isSaved: boolean
  inheritedSG?: number
}

export type StepStateMap = Map<string, StepState>

export const calculateDepthCount = (node: ExecutionWrapper, stepStates: StepStateMap): number => {
  let depth = 0.7 // half of gap
  if (node?.stepGroup) {
    const stepState = stepStates.get(node.stepGroup.identifier)
    // If Group is collapsed then send the same depth
    if (stepState && stepState.isStepGroupCollapsed) {
      return depth
    }
    depth = 1
    if (node.stepGroup.steps?.length > 0) {
      let maxParallelSteps = 0
      node.stepGroup.steps.forEach((nodeP: ExecutionWrapper) => {
        if (nodeP.parallel?.length > 0 && nodeP.parallel?.length > maxParallelSteps) {
          maxParallelSteps = nodeP.parallel.length
        }
      })
      if (maxParallelSteps > 0) {
        depth += 0.5 * (maxParallelSteps - 1)
      }
    }
  }
  return depth
}

export const getStepFromNode = (
  stepData: Required<ExecutionElement> | undefined,
  node: Diagram.DefaultNodeModel,
  isComplete = false,
  isFindParallelNode = false
): { node: ExecutionWrapper | undefined; parent: ExecutionWrapper[] } => {
  let data = stepData
  const layer = node.getParent()
  if (layer instanceof Diagram.StepGroupNodeLayerModel) {
    const group = getStepFromId(data, layer.getIdentifier() || '', false).node
    if (group) {
      data = group as Required<ExecutionElement>
    }
  }
  return getStepFromId(data, node.getIdentifier(), isComplete, isFindParallelNode)
}

const getStepFromId = (
  stageData: Required<ExecutionElement> | undefined,
  id: string,
  isComplete = false,
  isFindParallelNode = false
): { node: ExecutionWrapper | undefined; parent: ExecutionWrapper[] } => {
  let returnObj = getStepFromIdInternal(stageData?.steps, id, isComplete, isFindParallelNode)
  if (!returnObj.node) {
    returnObj = getStepFromIdInternal(stageData?.rollbackSteps, id, isComplete, isFindParallelNode)
  }
  return returnObj
}

const getStepFromIdInternal = (
  stepData: ExecutionWrapper[] | undefined,
  id: string,
  isComplete = false,
  isFindParallelNode = false
): { node: ExecutionWrapper | undefined; parent: ExecutionWrapper[] } => {
  let stepResp: ExecutionWrapper | undefined = undefined
  let parent: ExecutionWrapper[] | ExecutionParallelWrapper = []
  stepData?.every(node => {
    if (node.step && node.step.identifier === id) {
      if (isComplete) {
        stepResp = node
      } else {
        stepResp = node.step
      }
      parent = stepData
      return false
    } else if (node.parallel) {
      if (isFindParallelNode) {
        node.parallel?.every((nodeP: ExecutionWrapper) => {
          if (nodeP.step && nodeP.step.identifier === id) {
            if (isComplete) {
              stepResp = node
            } else {
              stepResp = node.parallel
            }
            parent = stepData
            return false
          } else if (nodeP.stepGroup) {
            if (nodeP.stepGroup?.identifier === id) {
              if (isComplete) {
                stepResp = node
              } else {
                stepResp = node.parallel
              }
              parent = stepData
              return false
            } else {
              const response = getStepFromId(nodeP.stepGroup, id, isComplete, isFindParallelNode)
              if (response.node) {
                parent = response.parent
                stepResp = response.node
                return false
              }
            }
          }
          return true
        })
        if (stepResp) {
          return false
        }
      } else {
        const response = getStepFromIdInternal(node.parallel, id, isComplete)
        if (response.node) {
          stepResp = response.node
          parent = response.parent
          return false
        }
      }
    } else if (node.stepGroup) {
      if (node.stepGroup?.identifier === id) {
        if (isComplete) {
          stepResp = node
        } else {
          stepResp = node.stepGroup
        }
        parent = stepData
        return false
      } else {
        const response = getStepFromId(node.stepGroup, id, isComplete, isFindParallelNode)
        if (response.node) {
          parent = response.parent
          stepResp = response.node
          return false
        }
      }
    }
    return true
  })
  return { parent, node: stepResp }
}

export const getStepsState = (node: ExecutionWrapper, mapState: StepStateMap): void => {
  if (node.step) {
    mapState.set(node.step.identifier, { isSaved: true, isStepGroup: false })
  } else if (node.steps) {
    node.steps.forEach((step: ExecutionWrapper) => {
      getStepsState(step, mapState)
    })
  } else if (node.rollbackSteps) {
    node.rollbackSteps.forEach((step: ExecutionWrapper) => {
      getStepsState(step, mapState)
    })
  } else if (node.parallel) {
    node.parallel.forEach((step: ExecutionWrapper) => {
      getStepsState(step, mapState)
    })
  } else if (node.stepGroup) {
    node.stepGroup.steps?.forEach?.((step: ExecutionWrapper) => {
      getStepsState(step, mapState)
    })
    node.stepGroup.rollbackSteps?.forEach?.((step: ExecutionWrapper) => {
      getStepsState(step, mapState)
    })
    mapState.set(
      node.stepGroup.identifier,
      mapState.get(node.stepGroup.identifier) || {
        isSaved: true,
        isStepGroupCollapsed: false,
        isStepGroupRollback: false,
        isStepGroup: true,
        isRollback: false
      }
    )
  }
}

export const removeStepOrGroup = (state: ExecutionGraphState, entity: Diagram.DefaultNodeModel): boolean => {
  let isRemoved = false
  let data = state.data
  const layer = entity.getParent()
  if (layer instanceof Diagram.StepGroupNodeLayerModel) {
    const node = getStepFromId(data, layer.getIdentifier() || '', false).node
    if (node) {
      data = node as Required<ExecutionElement>
    }
  }
  const response = getStepFromId(data, entity.getIdentifier(), true)
  if (response.node) {
    const index = response.parent.indexOf(response.node)
    if (index > -1) {
      response.parent.splice(index, 1)
      isRemoved = true
    }
  }
  return isRemoved
}

export const isLinkUnderStepGroup = (link: Diagram.DefaultLinkModel): boolean => {
  const sourceNode = link.getSourcePort().getNode() as Diagram.DefaultNodeModel
  const targetNode = link.getTargetPort().getNode() as Diagram.DefaultNodeModel
  if (
    sourceNode.getParent() instanceof Diagram.StepGroupNodeLayerModel &&
    targetNode.getParent() instanceof Diagram.StepGroupNodeLayerModel
  ) {
    return true
  }
  return false
}

export const addStepOrGroup = (
  entity: BaseModel,
  data: Required<ExecutionElement>,
  step: ExecutionWrapper,
  isParallel: boolean,
  isRollback: boolean
): void => {
  if (entity instanceof Diagram.DefaultLinkModel) {
    const sourceNode = entity.getSourcePort().getNode() as Diagram.DefaultNodeModel
    const targetNode = entity.getTargetPort().getNode() as Diagram.DefaultNodeModel
    if (isLinkUnderStepGroup(entity)) {
      const layer = sourceNode.getParent()
      if (layer instanceof Diagram.StepGroupNodeLayerModel) {
        const node = getStepFromId(data, layer.getIdentifier() || '', false).node
        if (node) {
          data = node as Required<ExecutionElement>
        }
      }
    }
    let response = getStepFromId(data, sourceNode.getIdentifier(), true)
    let next = 1
    if (!response.node) {
      response = getStepFromId(data, targetNode.getIdentifier(), true)
      next = 0
    }
    if (response.node) {
      const index = response.parent.indexOf(response.node)
      if (index > -1) {
        response.parent.splice(index + next, 0, step)
      }
    } else {
      // parallel next parallel case
      let nodeId = sourceNode.getIdentifier().split(EmptyNodeSeparator)[1]
      response = getStepFromId(data, nodeId, true, true)
      next = 1
      if (!response.node) {
        nodeId = targetNode.getIdentifier().split(EmptyNodeSeparator)[2]
        response = getStepFromId(data, nodeId, true, true)
        next = 0
      }
      if (response.node) {
        const index = response.parent.indexOf(response.node)
        if (index > -1) {
          response.parent.splice(index + next, 0, step)
        }
      }
    }
  } else if (entity instanceof Diagram.CreateNewModel) {
    // Steps if you are under step group
    const groupId = entity.getIdentifier().split(EmptyNodeSeparator)[1]
    const node = getStepFromId(data, groupId).node
    const layer = entity.getParent()
    if (layer instanceof Diagram.StepGroupNodeLayerModel) {
      const options = layer.getOptions() as Diagram.StepGroupNodeLayerOptions
      const isRollbackGroup = options.rollBackProps?.active === Diagram.StepsType.Rollback
      if (!isRollbackGroup && node?.steps) {
        node.steps.push(step)
      } else if (isRollbackGroup && node?.rollbackSteps) {
        node.rollbackSteps.push(step)
      }
    } else {
      if (isRollback) {
        data.rollbackSteps.push(step)
      } else {
        data.steps.push(step)
      }
    }
  } else if (entity instanceof Diagram.DefaultNodeModel) {
    if (isParallel) {
      const response = getStepFromId(data, entity.getIdentifier(), true, true)
      if (response.node) {
        if (response.node.parallel && response.node.parallel.length > 0) {
          response.node.parallel.push(step)
        } else {
          const index = response.parent.indexOf(response.node)
          if (index > -1) {
            response.parent.splice(index, 1, { parallel: [response.node, step] })
          }
        }
      }
    } else {
      if (isRollback) {
        data.rollbackSteps.push(step)
      } else {
        data.steps.push(step)
      }
    }
  } else if (entity instanceof Diagram.StepGroupNodeLayerModel) {
    if (isParallel) {
      const response = getStepFromId(data, entity.getIdentifier() || '', true, true)
      if (response.node) {
        if (response.node.parallel && response.node.parallel.length > 0) {
          response.node.parallel.push(step)
        } else {
          const index = response.parent.indexOf(response.node)
          if (index > -1) {
            response.parent.splice(index, 1, { parallel: [response.node, step] })
          }
        }
      }
    }
  }
}
