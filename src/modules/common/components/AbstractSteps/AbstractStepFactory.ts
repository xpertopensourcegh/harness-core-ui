import type { IconName } from '@wings-software/uikit'
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
  }

  deregisterStep(type: string): void {
    this.stepBank.delete(type)
    this.stepIconMap.delete(type)
  }

  getStep<T extends object>(type: string): Step<T> | undefined {
    return this.stepBank.get(type) as Step<T>
  }

  getStepIcon(type: string): IconName | undefined {
    return this.stepBank.get(type)?.getIconName()
  }

  getStepData(type: string): StepData | undefined {
    return this.stepIconMap.get(type)
  }

  getAllStepsDataList(): Array<StepData> {
    return Array.from(this.stepIconMap, ([_key, value]) => value).filter(step => step.visible)
  }
}
