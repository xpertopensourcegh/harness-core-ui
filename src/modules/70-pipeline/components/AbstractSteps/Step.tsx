import type { IconName } from '@wings-software/uicore'
import type { FormikErrors } from 'formik'
import type { CompletionItemInterface } from '@common/interfaces/YAMLBuilderProps'
import type { UseStringsReturn } from 'framework/exports'
import type { AbstractStepFactory } from './AbstractStepFactory'

export enum StepViewType {
  InputSet = 'InputSet',
  InputVariable = 'InputVariable',
  DeploymentForm = 'DeploymentForm',
  StageVariable = 'StageVariable',
  Edit = 'Edit'
}

export interface InputSetData<T> {
  template?: T
  allValues?: T
  path: string
  readonly?: boolean
}

export interface StepProps<T> {
  initialValues: T
  onUpdate?: (data: T) => void
  stepViewType?: StepViewType
  inputSetData?: InputSetData<T>
  factory?: AbstractStepFactory
}

export abstract class Step<T> {
  protected abstract type: string
  protected abstract defaultValues: T
  protected abstract stepIcon: IconName
  protected abstract stepName: string
  protected invocationMap?: Map<
    RegExp,
    (path: string, yaml: string, params: Record<string, unknown>) => Promise<CompletionItemInterface[]>
  >
  abstract validateInputSet(data: T, template?: T, getString?: UseStringsReturn['getString']): FormikErrors<T>

  protected stepPaletteVisible?: boolean // default to true

  getType(): string {
    return this.type
  }

  getDefaultValues(initialValues: T, _stepViewType: StepViewType): T {
    return { ...this.defaultValues, ...initialValues }
  }

  getIconName(): IconName {
    return this.stepIcon
  }

  getStepName(): string {
    return this.stepName
  }

  getInvocationMap():
    | Map<RegExp, (path: string, yaml: string, params: Record<string, unknown>) => Promise<CompletionItemInterface[]>>
    | undefined {
    return this.invocationMap
  }

  getStepPaletteVisibility(): boolean {
    return this.stepPaletteVisible ?? true
  }

  abstract renderStep(props: StepProps<T>): JSX.Element
}
