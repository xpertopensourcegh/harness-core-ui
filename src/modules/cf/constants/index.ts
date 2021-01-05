import { useStrings } from 'framework/exports'

export const useOperators = (
  i18nFn: (key: string) => string,
  keyMapper: (key: string) => string = x => x,
  extraOperators: Record<string, string> = {}
) => {
  const getString = i18nFn
  const base = [
    { label: getString(keyMapper('startsWith')), value: 'starts_with' },
    { label: getString(keyMapper('endsWith')), value: 'ends_with' },
    { label: getString(keyMapper('match')), value: 'match' },
    { label: getString(keyMapper('contains')), value: 'contains' },
    { label: getString(keyMapper('equal')), value: 'equal' },
    { label: getString(keyMapper('equalSensitive')), value: 'equal_sensitive' },
    { label: getString(keyMapper('in')), value: 'in' }
  ]

  const extra = Object.entries(extraOperators).map(([key, value]) => {
    return {
      label: getString(keyMapper(key)),
      value
    }
  })

  return base.concat(extra)
}

export const useOperatorsFromYaml = (extraOperators: Record<string, string> = {}) => {
  const { getString } = useStrings()
  return useOperators(getString, key => `cf.clause.operators.${key}`, extraOperators)
}

export const extraOperators = {
  customRules: { matchSegment: 'segmentMatch' }
}
