import type { SelectOption } from '@wings-software/uicore'
import { GetEnvironmentListForProjectQueryParams, useGetEnvironmentListForProject } from 'services/cd-ng'

export const useEnvironments = (queryParams: GetEnvironmentListForProjectQueryParams) => {
  const { data: environments, loading, error, refetch } = useGetEnvironmentListForProject({
    queryParams
  })

  const convertToSelectOptions: SelectOption[] =
    environments?.data?.content?.map<SelectOption>(elem => ({
      label: elem.name as string,
      value: elem.identifier as string
    })) || []

  return {
    data: convertToSelectOptions,
    loading,
    error,
    refetch
  }
}
