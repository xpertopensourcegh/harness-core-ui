import React from 'react'

import type { StringsMap as OGStringsMap } from 'stringTypes'
import { useGlobalEventListener } from '@common/hooks/useGlobalEventListener'
import languageLoader, { HarnessModules } from './languageLoader'

import { StringsContext } from './StringsContext'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StringsMap = Record<string, any>

// add custom event to the global scope
declare global {
  interface WindowEventMap {
    LOAD_STRINGS_CHUNK: CustomEvent<HarnessModules[]>
  }
}

export interface StringsContextProviderProps {
  children: React.ReactNode
  initialStrings?: Record<string, any> // temp prop for backward compatability
}

export function StringsContextProvider(props: StringsContextProviderProps): React.ReactElement {
  const [strings, setStrings] = React.useState<StringsMap>(props.initialStrings || {})

  useGlobalEventListener('LOAD_STRINGS_CHUNK', (e: CustomEvent<HarnessModules[]>) => {
    const mods = e.detail

    const promises = mods.map(mod => languageLoader('en', mod).then<[HarnessModules, StringsMap]>(data => [mod, data]))

    Promise.all(promises).then(data => {
      const newData = data.reduce<StringsMap>((acc, [mod, values]) => ({ ...acc, [mod]: values.default }), {})

      setStrings(oldData => ({
        ...oldData,
        ...newData
      }))
    })
  })

  return <StringsContext.Provider value={strings as OGStringsMap}>{props.children}</StringsContext.Provider>
}
