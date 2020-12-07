import React from 'react'
import { useParams } from 'react-router-dom'

import type { Project, Organization } from 'services/cd-ng'
import type { User } from 'services/portal'
import { useGetOrganizationList, useGetProjectList } from 'services/cd-ng'
import { useGetUser } from 'services/portal'
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

  /** Organisation Map */
  readonly organisationsMap: Map<string, Organization>

  /** Current user info */
  readonly user: Partial<User>

  /** strings for i18n */
  readonly strings: StringsMap

  updateAppStore(data: Partial<Pick<AppStoreContextProps, 'projects' | 'organisationsMap'>>): void
}

const getOrganisationMap = (orgsData: Organization[]): Map<string, Organization> => {
  const orgMap: Map<string, Organization> = new Map<string, Organization>()
  orgsData.map(org => {
    orgMap.set(org.identifier || '', org)
  })
  return orgMap
}

export const AppStoreContext = React.createContext<AppStoreContextProps>({
  projects: [],
  organisationsMap: new Map(),
  user: {},
  strings: {},
  updateAppStore: () => void 0
})

export function useAppStore(): AppStoreContextProps {
  return React.useContext(AppStoreContext)
}

export function AppStoreProvider(props: React.PropsWithChildren<{ strings: StringsMap }>): React.ReactElement {
  const { accountId } = useParams<{ accountId: string }>()
  const [state, setState] = React.useState<Omit<AppStoreContextProps, 'updateAppStore' | 'strings'>>({
    user: {},
    projects: [],
    organisationsMap: new Map()
  })

  const { loading: orgLoading, data: orgs } = useGetOrganizationList({
    queryParams: {
      accountIdentifier: accountId
    }
  })

  const { loading: projectsLoading, data: projects } = useGetProjectList({
    queryParams: {
      accountIdentifier: accountId
    }
  })

  const { loading: userLoading, data: user } = useGetUser({})

  React.useEffect(() => {
    setState(prevState => ({ ...prevState, projects: projects?.data?.content || [] }))
  }, [projects?.data?.content])

  React.useEffect(() => {
    setState(prevState => ({ ...prevState, organisationsMap: getOrganisationMap(orgs?.data?.content || []) }))
  }, [orgs?.data?.content])

  React.useEffect(() => {
    setState(prevState => ({ ...prevState, user: user?.resource || {} }))
  }, [user?.resource])

  function updateAppStore(data: Partial<Pick<AppStoreContextProps, 'projects' | 'organisationsMap'>>): void {
    setState(prevState => ({
      ...prevState,
      projects: data.projects || prevState.projects,
      organisationsMap: data.organisationsMap || prevState.organisationsMap
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
      {orgLoading || userLoading || projectsLoading ? <PageSpinner /> : props.children}
    </AppStoreContext.Provider>
  )
}
