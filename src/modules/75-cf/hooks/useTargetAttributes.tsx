import React, { createContext, ReactElement, ReactNode, useContext, useMemo } from 'react'
import { useGetAllTargetAttributes } from 'services/cf'
import { sortStrings } from '@cf/utils/sortStrings'

export interface UseTargetAttributesHookAPI {
  loading: boolean
  targetAttributes: string[]
}

export interface TargetAttributesProviderProps {
  project: string
  org: string
  accountIdentifier: string
  environment: string
  children?: ReactNode | ReactNode[]
}

const TargetAttributesContext = createContext<UseTargetAttributesHookAPI>({ loading: false, targetAttributes: [] })

export const TargetAttributesProvider = ({
  project,
  org,
  accountIdentifier,
  environment,
  children
}: TargetAttributesProviderProps): ReactElement => {
  const { loading, data } = useGetAllTargetAttributes({ queryParams: { project, org, accountIdentifier, environment } })

  const targetAttributes = useMemo<string[]>(() => sortStrings(data || []), [data])

  return (
    <TargetAttributesContext.Provider value={{ loading, targetAttributes }}>
      {children}
    </TargetAttributesContext.Provider>
  )
}

export const useTargetAttributes = (): UseTargetAttributesHookAPI => useContext(TargetAttributesContext)
