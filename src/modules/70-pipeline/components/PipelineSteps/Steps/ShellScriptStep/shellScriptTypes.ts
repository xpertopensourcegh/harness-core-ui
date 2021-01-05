import type { ShellScriptStepInfo, StepElement } from 'services/cd-ng'

export interface ShellScriptStepVariable {
  value: number | string
  id: string
  name?: string
  type?: 'String' | 'Number'
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
    environmentVariables?: string | Array<Omit<ShellScriptStepVariable, 'id'>>
    outputVariables?: string | Array<Omit<ShellScriptStepVariable, 'id'>>
    source?: ShellScriptSource
  }
}

export interface ShellScriptFormData extends StepElement {
  spec: Omit<ShellScriptStepInfo, 'environmentVariables' | 'outputVariables' | 'source'> & {
    environmentVariables?: string | Array<ShellScriptStepVariable>
    outputVariables?: string | Array<ShellScriptStepVariable>
    source?: ShellScriptSource
  }
}
