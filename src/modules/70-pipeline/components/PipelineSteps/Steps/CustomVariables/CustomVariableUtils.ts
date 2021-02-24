import type { SelectOption } from '@wings-software/uicore'

export enum VariableType {
  String = 'String',
  Secret = 'Secret',
  Number = 'Number'
}

export const labelStringMap: Record<VariableType, string> = {
  [VariableType.String]: 'string',
  [VariableType.Secret]: 'secretType',
  [VariableType.Number]: 'number'
}

export const getVaribaleTypeOptions = (getString: (key: string) => string): SelectOption[] =>
  [VariableType.String, VariableType.Secret, VariableType.Number].map(type => ({
    label: getString(labelStringMap[type]),
    value: type
  }))
