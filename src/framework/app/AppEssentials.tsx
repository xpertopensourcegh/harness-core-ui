import React, { useEffect } from 'react'
import { matchPath } from 'react-router'
import { useIsMounted } from '@wings-software/uikit'
import type { GetDataError } from 'restful-react'
import { AUTH_ROUTE_PATH_PREFIX } from 'framework/utils/framework-utils'
import { PageSpinner } from 'modules/common/components/Page/PageSpinner'
import { useGetProjectListBasedOnFilter, FailureDTO, ErrorDTO } from 'services/cd-ng'
import type { AppStore } from 'framework/types/AppStore'

export interface FetchingAppEssentialsProps {
  onSuccess: (data: Partial<Pick<AppStore, 'projects'>>) => void
  onError: (error: GetDataError<FailureDTO | ErrorDTO>) => void
}

export const AppEssentials: React.FC<FetchingAppEssentialsProps> = ({ onSuccess, onError }) => {
  const match = matchPath('/' + location.href.split('/#/')[1], {
    path: AUTH_ROUTE_PATH_PREFIX
  })
  const accountId = (match?.params as { accountId: string })?.accountId
  const isMounted = useIsMounted()
  const { loading, data, error } = useGetProjectListBasedOnFilter({
    queryParams: {
      accountIdentifier: accountId
    }
  })

  useEffect(() => {
    if (isMounted.current && !loading) {
      if (!error) {
        onSuccess({ projects: data?.data?.content || [] })
      } else {
        onError(error)
      }
    }
  }, [loading]) // eslint-disable-line react-hooks/exhaustive-deps

  return loading ? <PageSpinner /> : null
}
