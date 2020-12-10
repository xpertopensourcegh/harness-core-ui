import React from 'react'
import { useParams } from 'react-router-dom'

import type { Project } from 'services/cd-ng'
import { useGetProjectList } from 'services/cd-ng'
import { PageSpinner } from '@common/components/Page/PageSpinner'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StringsMap = Record<string, Record<string, any>>

/**
 * Application Store - essential application-level states which are shareable
 * across Framework and Modules. These states are writeable within Frameworks.
 * Modules are allowed to read only.
 */
export interface AppStoreContextProps {
  readonly projects: Project[]

  /** strings for i18n */
  readonly strings: StringsMap

  updateAppStore(data: Partial<Pick<AppStoreContextProps, 'projects'>>): void
}

export const AppStoreContext = React.createContext<AppStoreContextProps>({
  projects: [],
  strings: {},
  updateAppStore: () => void 0
})

export function useAppStore(): AppStoreContextProps {
  return React.useContext(AppStoreContext)
}

export function AppStoreProvider(props: React.PropsWithChildren<{ strings: StringsMap }>): React.ReactElement {
  const { accountId } = useParams<{ accountId: string }>()
  const [state, setState] = React.useState<Omit<AppStoreContextProps, 'updateAppStore' | 'strings'>>({
    projects: []
  })

  const { loading: projectsLoading, data: projects } = useGetProjectList({
    queryParams: {
      accountIdentifier: accountId
    }
  })

  React.useEffect(() => {
    setState(prevState => ({
      ...prevState,
      projects: projects?.data?.content?.map(response => response.project) || []
    }))
  }, [projects?.data?.content])

  function updateAppStore(data: Partial<Pick<AppStoreContextProps, 'projects'>>): void {
    setState(prevState => ({
      ...prevState,
      projects: data.projects || prevState.projects
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
      {projectsLoading ? <PageSpinner /> : props.children}
    </AppStoreContext.Provider>
  )
}
