import type { IconName } from '@wings-software/uikit'

export enum StepViewType {
  InputSet = 'InputSet',
  DeploymentForm = 'DeploymentForm',
  Edit = 'Edit'
}
export abstract class Step<T extends object> {
  protected abstract type: string
  protected abstract defaultValues: T
  protected abstract stepIcon: IconName
  protected abstract stepName: string

  getType(): string {
    return this.type
  }

  getDefaultValues(): T {
    return this.defaultValues
  }

  getIconName(): IconName {
    return this.stepIcon
  }

  getStepName(): string {
    return this.stepName
  }

  abstract renderStep(initialValues: T, onUpdate?: (data: T) => void, stepViewType?: StepViewType): JSX.Element
}
