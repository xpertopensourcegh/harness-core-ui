import React, { useEffect } from 'react'
import { matchPath } from 'react-router'
import { useIsMounted } from '@wings-software/uikit'
import type { GetDataError } from 'restful-react'
import { AUTH_ROUTE_PATH_PREFIX } from 'framework/utils/framework-utils'
import { PageSpinner } from '@common/components/Page/PageSpinner'
import { useGetProjectList, Failure, Error, useGetOrganizationList, Organization } from 'services/cd-ng'
import { useGetUser } from 'services/portal'
import type { AppStore } from 'framework/types/AppStore'

export interface FetchingAppEssentialsProps {
  onSuccess: (data: Partial<Pick<AppStore, 'projects' | 'organisationsMap' | 'user'>>) => void
  onError: (error: GetDataError<Failure | Error | unknown>) => void
}

export const AppEssentials: React.FC<FetchingAppEssentialsProps> = ({ onSuccess, onError }) => {
  const match = matchPath('/' + location.href.split('/#/')[1], {
    path: AUTH_ROUTE_PATH_PREFIX
  })
  const accountId = (match?.params as { accountId: string })?.accountId
  const isMounted = useIsMounted()
  const { loading, data: projects, error: projectError } = useGetProjectList({
    queryParams: {
      accountIdentifier: accountId
    }
  })

  const { loading: orgLoading, data: orgs, error: orgError } = useGetOrganizationList({
    queryParams: {
      accountIdentifier: accountId
    }
  })

  const getOrganisationMap = (orgsData: Organization[]): Map<string, Organization> => {
    const orgMap: Map<string, Organization> = new Map<string, Organization>()
    orgsData.map(org => {
      orgMap.set(org.identifier || '', org)
    })
    return orgMap
  }

  const { loading: userLoading, data: user, error: userError } = useGetUser({})

  useEffect(() => {
    if (isMounted.current && !loading && !orgLoading) {
      if ((!projectError && !orgError) || !userError) {
        onSuccess({
          projects: projects?.data?.content || [],
          organisationsMap: getOrganisationMap(orgs?.data?.content || []),
          user: user?.resource
        })
      } else {
        if (projectError) {
          onError(projectError)
        } else if (orgError) {
          onError(orgError)
        } else if (userError) {
          onError(userError)
        }
      }
    }
  }, [loading, orgLoading, userLoading]) // eslint-disable-line react-hooks/exhaustive-deps

  return loading || orgLoading || userLoading ? <PageSpinner /> : null
}
