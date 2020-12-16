import type { SelectOption } from '@wings-software/uikit'
import type { HttpStepInfo, StepElement } from 'services/cd-ng'

export interface HttpStepHeader {
  id: string
  key: string
  value: string
}

export interface HttpStepOutputVariable {
  id: string
  name: string
  value: string
  type: string
}

export interface HttpStepData extends StepElement {
  spec: HttpStepInfo & {
    requestBody?: string
    headers?: string | Array<Omit<HttpStepHeader, 'id'>>
    outputVariables?: string | Array<Omit<HttpStepOutputVariable, 'id'>>
    timeout: string
  }
}

export interface HttpStepFormData extends StepElement {
  spec: Omit<HttpStepInfo, 'method'> & {
    method?: string | SelectOption
    requestBody?: string
    headers?: string | HttpStepHeader[]
    outputVariables?: string | HttpStepOutputVariable[]
    timeout: string
  }
}
