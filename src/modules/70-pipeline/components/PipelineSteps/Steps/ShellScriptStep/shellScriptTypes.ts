import type { ShellScriptStepInfo, StepElement } from 'services/cd-ng'

export interface ShellScriptStepVariable {
  value: number | string
  id: string
  name?: string
  type?: 'String' | 'Number'
}
export interface ShellScriptOutputStepVariable {
  value: number | string
  id: string
  name?: string
  type?: 'String'
}
interface ShellScriptSource {
  type?: string
  spec?: ShellScriptInline
}
export interface ShellScriptInline {
  script?: string
}
export interface ShellScriptData extends StepElement {
  spec: Omit<ShellScriptStepInfo, 'environmentVariables' | 'outputVariables' | 'source'> & {
    environmentVariables?: Array<Omit<ShellScriptStepVariable, 'id'>>
    outputVariables?: Array<Omit<ShellScriptOutputStepVariable, 'id'>>
    source?: ShellScriptSource
  }
}

export interface ShellScriptFormData extends StepElement {
  spec: Omit<ShellScriptStepInfo, 'environmentVariables' | 'outputVariables' | 'source'> & {
    environmentVariables?: Array<ShellScriptStepVariable>
    outputVariables?: Array<ShellScriptOutputStepVariable>
    source?: ShellScriptSource
  }
}
