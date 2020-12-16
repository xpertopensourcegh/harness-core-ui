import { useStrings } from 'framework/exports'

export const SharedQueryParams = {
  account: 'default',
  org: 'default_org'
}

export const useOperators = (i18nFn: (key: string) => string, keyMapper: (key: string) => string = x => x) => {
  const getString = i18nFn
  return [
    { label: getString(keyMapper('startsWith')), value: 'starts_with' },
    { label: getString(keyMapper('endsWith')), value: 'ends_with' },
    { label: getString(keyMapper('match')), value: 'match' },
    { label: getString(keyMapper('contains')), value: 'contains' },
    { label: getString(keyMapper('equal')), value: 'equal' },
    { label: getString(keyMapper('equalSensitive')), value: 'equal_sensitive' },
    { label: getString(keyMapper('in')), value: 'in' }
  ]
}

export const useOperatorsFromYaml = () => {
  const { getString } = useStrings()
  return useOperators(getString, key => `cf.clause.operators.${key}`)
}
