import React, { useEffect } from 'react'
import { matchPath } from 'react-router'
import { useIsMounted } from '@wings-software/uikit'
import type { GetDataError } from 'restful-react'
import { AUTH_ROUTE_PATH_PREFIX } from 'framework/utils/framework-utils'
import { PageSpinner } from 'modules/common/components/Page/PageSpinner'
import { useGetProjectList, FailureDTO, ErrorDTO, useGetOrganizationList, Organization } from 'services/cd-ng'
import type { AppStore } from 'framework/types/AppStore'

export interface FetchingAppEssentialsProps {
  onSuccess: (data: Partial<Pick<AppStore, 'projects' | 'organisationsMap'>>) => void
  onError: (error: GetDataError<FailureDTO | ErrorDTO>) => void
}

export const AppEssentials: React.FC<FetchingAppEssentialsProps> = ({ onSuccess, onError }) => {
  const match = matchPath('/' + location.href.split('/#/')[1], {
    path: AUTH_ROUTE_PATH_PREFIX
  })
  const accountId = (match?.params as { accountId: string })?.accountId
  const isMounted = useIsMounted()
  const { loading, data, error } = useGetProjectList({
    queryParams: {
      accountIdentifier: accountId
    }
  })

  const { loading: orgLoading, data: orgData, error: orgError } = useGetOrganizationList({
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

  useEffect(() => {
    if (isMounted.current && !loading && !orgLoading) {
      if (!error && !orgError) {
        onSuccess({
          projects: data?.data?.content || [],
          organisationsMap: getOrganisationMap(orgData?.data?.content || [])
        })
      } else {
        error && onError(error)
        orgError && onError(orgError)
      }
    }
  }, [loading, orgLoading]) // eslint-disable-line react-hooks/exhaustive-deps

  return loading || orgLoading ? <PageSpinner /> : null
}
