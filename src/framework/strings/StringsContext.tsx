import React from 'react'

import type { StringsMap } from 'stringTypes'
import type { HarnessModules } from './languageLoader'

export type StringKeys = keyof StringsMap

export type { HarnessModules, StringsMap }

export const StringsContext = React.createContext<StringsMap>({} as StringsMap)

export function useStringsContext(): StringsMap {
  return React.useContext(StringsContext)
}
