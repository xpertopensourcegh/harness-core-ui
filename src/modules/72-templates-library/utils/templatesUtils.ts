import type { UseStringsReturn } from 'framework/strings'

export enum TemplateType {
  Step = 'Step',
  Stage = 'Stage',
  Pipeline = 'Pipeline',
  Service = 'Service',
  Infrastructure = 'Infrastructure',
  StepGroup = 'StepGroup',
  Execution = 'Execution'
}

export interface TemplateTypeOption {
  label: string
  value: string
  disabled?: boolean
}

export const getAllowedTemplateTypes = (getString: UseStringsReturn['getString']): TemplateTypeOption[] => [
  {
    label: getString('step'),
    value: TemplateType.Step
  },
  {
    label: getString('templatesLibrary.stageTemplate'),
    value: TemplateType.Stage
  },
  {
    label: getString('common.pipeline'),
    value: TemplateType.Pipeline
  },
  {
    label: getString('service'),
    value: TemplateType.Service
  },
  {
    label: getString('infrastructureText'),
    value: TemplateType.Infrastructure
  },
  {
    label: getString('stepGroup'),
    value: TemplateType.StepGroup
  },
  {
    label: getString('executionText'),
    value: TemplateType.Execution
  }
]
