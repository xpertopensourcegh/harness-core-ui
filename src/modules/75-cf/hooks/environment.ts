import { useStrings } from 'framework/strings'
import type { StringKeys } from 'framework/strings'

/**
 * getEnvString prepends "cf.environments" to given argument
 * Provides base getString in case of needing it
 */
export const useEnvStrings = () => {
  const { getString } = useStrings()
  return {
    getEnvString: (key: string, vars?: Record<string, any>) =>
      getString(`cf.environments.${key}` as StringKeys /* TODO: fix this by using a map */, vars),
    getString
  }
}
