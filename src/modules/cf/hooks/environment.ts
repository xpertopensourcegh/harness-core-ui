import type { SelectOption } from '@wings-software/uikit'
import { GetAllEnvironmentsQueryParams, useGetAllEnvironments } from 'services/cf'

export const useEnvironments = (queryParams: GetAllEnvironmentsQueryParams) => {
  const { data: environments, loading, error, refetch } = useGetAllEnvironments({
    queryParams
  })

  const convertToSelectOptions: SelectOption[] =
    environments?.data?.environments?.map<SelectOption>(elem => ({
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
