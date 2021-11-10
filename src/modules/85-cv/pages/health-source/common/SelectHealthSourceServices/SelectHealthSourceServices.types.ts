import type { FormikProps } from 'formik'
import type { useGetMetricPacks, useGetLabelNames } from 'services/cv'

export type SelectHealthSourceServicesProps = {
  formik: FormikProps<{
    sli: boolean
    healthScore: boolean
    continuousVerification: boolean
  }>
  metricPackResponse: ReturnType<typeof useGetMetricPacks>
  labelNamesResponse: ReturnType<typeof useGetLabelNames>
}
