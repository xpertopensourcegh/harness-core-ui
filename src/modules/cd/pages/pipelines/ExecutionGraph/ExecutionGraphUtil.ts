import type { NodeModelListener, LinkModelListener } from '@projectstorm/react-diagrams-core'
import type { BaseModelListener } from '@projectstorm/react-canvas-core'
import type { IconName } from '@wings-software/uikit'
import type { ExecutionWrapper } from 'services/cd-ng'

export enum StepType {
  HTTP = 'Http',
  SHELLSCRIPT = 'ShellScript',
  APPROVAL = 'Approval',
  StepGroup = 'StepGroup',
  K8sRolloutDeploy = 'K8sRolloutDeploy'
}

export const MapStepTypeToIcon: { [key in StepType]: IconName } = {
  StepGroup: 'step-group',
  Http: 'command-http',
  ShellScript: 'command-shell-script',
  K8sRolloutDeploy: 'service-kubernetes',
  Approval: 'command-approval'
}

export interface Listeners {
  nodeListeners: NodeModelListener
  linkListeners: LinkModelListener
  layerListeners: BaseModelListener
}

export interface StepState {
  isRollback?: boolean
  isStepGroupCollapsed?: boolean
  isStepGroup?: boolean
  isSaved: boolean
  inheritedSG?: number
}

export type StepStateMap = Map<string, StepState>

export const getStepTypeFromStep = (node: ExecutionWrapper): StepType => {
  if (node.step.type === StepType.HTTP) {
    return StepType.HTTP
  } else if (node.step.type === StepType.SHELLSCRIPT) {
    return StepType.SHELLSCRIPT
  } else if (node.step.type === StepType.K8sRolloutDeploy) {
    return StepType.K8sRolloutDeploy
  }
  return StepType.APPROVAL
}

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

export const getStepFromId = (
  stepData: ExecutionWrapper[] | undefined,
  id: string,
  isComplete = false
): { node: ExecutionWrapper | undefined; parent: ExecutionWrapper[] } => {
  let stepResp: ExecutionWrapper | undefined = undefined
  let parent: ExecutionWrapper[] = []
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
      const response = getStepFromId(node.parallel, id, isComplete)
      if (response.node) {
        stepResp = response.node
        parent = response.parent
        return false
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
        const response = getStepFromId(node.stepGroup?.steps, id, isComplete)
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

export const getStepsState = (node: ExecutionWrapper, mapState: StepStateMap, inheritedSG = 1): number => {
  if (node.step) {
    mapState.set(node.step.identifier, { isSaved: true, isStepGroup: false })
  } else if (node.steps) {
    node.steps.forEach((step: ExecutionWrapper) => {
      getStepsState(step, mapState)
    })
  } else if (node.parallel) {
    node.parallel.forEach((step: ExecutionWrapper) => {
      getStepsState(step, mapState)
    })
  } else if (node.stepGroup) {
    node.stepGroup.steps?.forEach?.((step: ExecutionWrapper) => {
      const inheritedSGTemp = getStepsState(step, mapState, inheritedSG)
      if (inheritedSGTemp > inheritedSG) {
        inheritedSG = inheritedSGTemp
      }
    })
    mapState.set(node.stepGroup.identifier, {
      isSaved: true,
      isStepGroupCollapsed: false,
      isStepGroup: true,
      isRollback: false,
      inheritedSG
    })
    inheritedSG++
  }
  return inheritedSG
}
