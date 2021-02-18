import { useStrings } from 'framework/exports'

export type OperatorOption = {
  label: string
  value: string
  single?: boolean
}

export type IsSingleValued = (operatorValue: string) => boolean

export const useOperators = (
  i18nFn: (key: string) => string,
  keyMapper: (key: string) => string = x => x,
  extraOperators: OperatorOption[] = []
): [OperatorOption[], IsSingleValued] => {
  const getString = i18nFn
  const base = [
    { label: getString(keyMapper('startsWith')), value: 'starts_with', single: true },
    { label: getString(keyMapper('endsWith')), value: 'ends_with', single: true },
    { label: getString(keyMapper('contains')), value: 'contains', single: false },
    { label: getString(keyMapper('equal')), value: 'equal', single: true },
    { label: getString(keyMapper('equalSensitive')), value: 'equal_sensitive', single: true },
    { label: getString(keyMapper('in')), value: 'in', single: false }
  ]

  const extra = extraOperators.map(({ label, value, single = false }) => {
    return {
      label: getString(keyMapper(label)),
      value,
      single
    }
  })

  const opList = base.concat(extra)
  const isSingleValued: IsSingleValued = (operatorValue: string) =>
    opList.find(op => op.value === operatorValue)?.single || false
  return [opList, isSingleValued]
}

export const useOperatorsFromYaml = (extraOperators: OperatorOption[] = []): [OperatorOption[], IsSingleValued] => {
  const { getString } = useStrings()
  return useOperators(getString, key => `cf.clause.operators.${key}`, extraOperators)
}

export const extraOperatorReference: Record<string, Record<string, OperatorOption>> = {
  customRules: {
    matchSegment: {
      label: 'matchSegment',
      value: 'segmentMatch',
      single: false
    }
  }
}

export const extraOperators: Record<string, OperatorOption[]> = Object.entries(extraOperatorReference).reduce(
  (acc: Record<string, OperatorOption[]>, [key, value]: [string, Record<string, OperatorOption>]) => {
    acc[key] = Object.values(value)
    return acc
  },
  {} as Record<string, OperatorOption[]>
)
