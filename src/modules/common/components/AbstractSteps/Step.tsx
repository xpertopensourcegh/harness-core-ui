import type { IconName } from '@wings-software/uikit'
import type { CompletionItemInterface } from 'modules/common/interfaces/YAMLBuilderProps'

export enum StepViewType {
  InputSet = 'InputSet',
  InputVariable = 'InputVariable',
  DeploymentForm = 'DeploymentForm',
  StageVariable = 'StageVariable',
  Edit = 'Edit'
}
export abstract class Step<T extends object> {
  protected abstract type: string
  protected abstract defaultValues: T
  protected abstract stepIcon: IconName
  protected abstract stepName: string
  protected invocationMap?: Map<RegExp, (path: string, yaml: string) => Promise<CompletionItemInterface[]>>

  protected stepPaletteVisible?: boolean // default to true

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

  getInvocationMap(): Map<RegExp, (path: string, yaml: string) => Promise<CompletionItemInterface[]>> | undefined {
    return this.invocationMap
  }

  getStepPaletteVisibility(): boolean {
    return this.stepPaletteVisible ?? true
  }

  abstract renderStep(
    initialValues: T,
    onUpdate?: (data: T) => void,
    stepViewType?: StepViewType,
    template?: { [P in keyof T]: string }
  ): JSX.Element
}
