import type { IconName } from '@wings-software/uikit'
import { isEmpty } from 'lodash-es'
import type { CompletionItemInterface } from '@common/interfaces/YAMLBuilderProps'
import type { Step } from './Step'

export interface StepData {
  name: string
  icon: IconName
  type: string
  visible?: boolean
}

export abstract class AbstractStepFactory {
  /**
   * Couples the factory with the steps it generates
   */
  protected abstract type: string

  protected stepBank: Map<string, Step<object>>
  protected stepIconMap: Map<string, StepData>
  protected invocationMap: Map<
    RegExp,
    (path: string, yaml: string, params: Record<string, unknown>) => Promise<CompletionItemInterface[]>
  > = new Map()

  constructor() {
    this.stepBank = new Map()
    this.stepIconMap = new Map()
  }

  getType(): string {
    return this.type
  }

  registerStep<T extends object>(step: Step<T>): void {
    this.stepBank.set(step.getType(), step)
    this.stepIconMap.set(step.getType(), {
      name: step.getStepName(),
      icon: step.getIconName(),
      type: step.getType(),
      visible: step.getStepPaletteVisibility()
    })
    const stepMap = step.getInvocationMap()
    if (stepMap) {
      this.invocationMap = new Map([...this.invocationMap, ...stepMap])
    }
  }

  deregisterStep(type: string): void {
    const deletedStep = this.stepBank.get(type)
    if (deletedStep) {
      this.stepBank.delete(type)
      this.stepIconMap.delete(type)
      if (deletedStep.getInvocationMap()) {
        this.invocationMap = new Map()
        this.stepBank.forEach(step => {
          const stepMap = step.getInvocationMap()
          if (stepMap) {
            this.invocationMap = new Map([...this.invocationMap, ...stepMap])
          }
        })
      }
    }
  }

  getStep<T extends object>(type?: string): Step<T> | undefined {
    if (type && !isEmpty(type)) {
      return this.stepBank.get(type) as Step<T>
    }
    return
  }

  getStepIcon(type: string): IconName {
    return this.stepBank.get(type)?.getIconName() || 'disable'
  }

  getStepData(type: string): StepData | undefined {
    return this.stepIconMap.get(type)
  }

  getInvocationMap(): Map<
    RegExp,
    (path: string, yaml: string, params: Record<string, unknown>) => Promise<CompletionItemInterface[]>
  > {
    return this.invocationMap
  }

  getAllStepsDataList(): Array<StepData> {
    return Array.from(this.stepIconMap, ([_key, value]) => value).filter(step => step.visible)
  }
}
