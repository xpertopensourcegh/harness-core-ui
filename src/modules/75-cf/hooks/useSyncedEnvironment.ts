import { useEffect } from 'react'
import { useGetEnvironment } from 'services/cd-ng'
import { useLocalStorage } from '@common/hooks'
import { CF_LOCAL_STORAGE_ENV_KEY, DEFAULT_ENV } from '@cf/utils/CFUtils'

export interface UseSyncedEnvironmentProps {
  accountId: string
  orgIdentifier: string
  projectIdentifier: string
  environmentIdentifier: string
}

export const useSyncedEnvironment = ({
  accountId,
  orgIdentifier,
  projectIdentifier,
  environmentIdentifier
}: UseSyncedEnvironmentProps) => {
  const [environment, setEnvironment] = useLocalStorage(CF_LOCAL_STORAGE_ENV_KEY, DEFAULT_ENV)
  const { loading, data, error, refetch } = useGetEnvironment({
    environmentIdentifier,
    queryParams: {
      accountId,
      projectIdentifier,
      orgIdentifier
    }
  })

  useEffect(() => {
    if (data?.data) {
      setEnvironment({ label: data.data.name as string, value: data.data.identifier as string })
    }
  }, [data])

  return {
    environment,
    setEnvironment,
    data,
    loading,
    error,
    refetch
  }
}
