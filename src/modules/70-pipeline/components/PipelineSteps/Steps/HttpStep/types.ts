import type { SelectOption } from '@wings-software/uicore'
import type { HttpStepInfo, StepElement, HttpHeaderConfig, NGVariable } from 'services/cd-ng'

export interface HttpStepHeaderConfig extends HttpHeaderConfig {
  id: string
}

export interface HttpStepOutputVariable extends NGVariable {
  id: string
}

export interface HttpStepData extends StepElement {
  spec: Omit<HttpStepInfo, 'header' | 'outputVariables'> & {
    header?: HttpHeaderConfig[] | string
    outputVariables?: NGVariable[] | string
  }
}

export interface HttpStepFormData extends StepElement {
  spec: Omit<HttpStepInfo, 'method' | 'header' | 'outputVariables'> & {
    method: SelectOption | string
    header?: HttpStepHeaderConfig[] | string
    outputVariables?: HttpStepOutputVariable[] | string
  }
}
