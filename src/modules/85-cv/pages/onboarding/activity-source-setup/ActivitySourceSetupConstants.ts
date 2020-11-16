import type { SelectOption } from '@wings-software/uikit'

export const InfrastructureTypes = {
  NON_PRODUCTION: 'NonProduction',
  PRODUCTION: 'Production'
}

export const InfrastructureTypeOptions: SelectOption[] = [
  {
    label: 'Non Production',
    value: InfrastructureTypes.NON_PRODUCTION
  },
  {
    label: 'Production',
    value: InfrastructureTypes.PRODUCTION
  }
]
