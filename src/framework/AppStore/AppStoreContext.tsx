import React from 'react'
import { useParams } from 'react-router-dom'

import { Project, useGetProject } from 'services/cd-ng'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StringsMap = Record<string, Record<string, any>>

/**
 * Application Store - essential application-level states which are shareable
 * across Framework and Modules. These states are writeable within Frameworks.
 * Modules are allowed to read only.
 */
export interface AppStoreContextProps {
  readonly selectedProject?: Project

  /** strings for i18n */
  readonly strings: StringsMap

  updateAppStore(data: Partial<Pick<AppStoreContextProps, 'selectedProject'>>): void
}

export const AppStoreContext = React.createContext<AppStoreContextProps>({
  strings: {},
  updateAppStore: () => void 0
})

export function useAppStore(): AppStoreContextProps {
  return React.useContext(AppStoreContext)
}

export function AppStoreProvider(props: React.PropsWithChildren<{ strings: StringsMap }>): React.ReactElement {
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const [state, setState] = React.useState<Omit<AppStoreContextProps, 'updateAppStore' | 'strings'>>()

  const { refetch, data: project } = useGetProject({
    identifier: projectIdentifier,
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier
    },
    lazy: true
  })

  React.useEffect(() => {
    setState(prevState => ({
      ...prevState,
      selectedProject: project?.data?.project
    }))
  }, [project?.data?.project])

  React.useEffect(() => {
    if (projectIdentifier && orgIdentifier) refetch()
    if (!projectIdentifier || !orgIdentifier) {
      setState(prevState => ({
        ...prevState,
        selectedProject: undefined
      }))
    }
  }, [projectIdentifier, orgIdentifier])

  function updateAppStore(data: Partial<Pick<AppStoreContextProps, 'selectedProject'>>): void {
    setState(prevState => ({
      ...prevState,
      selectedProject: data.selectedProject || prevState?.selectedProject
    }))
  }

  return (
    <AppStoreContext.Provider
      value={{
        ...state,
        strings: props.strings,
        updateAppStore
      }}
    >
      {props.children}
    </AppStoreContext.Provider>
  )
}
