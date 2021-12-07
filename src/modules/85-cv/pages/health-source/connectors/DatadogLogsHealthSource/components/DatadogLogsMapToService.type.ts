import type { FormikProps } from 'formik'
import type { DatadogLogsInfo } from '@cv/pages/health-source/connectors/DatadogLogsHealthSource/DatadogLogsHealthSource.type'

export interface DatadogLogsMapToServiceProps {
  formikProps: FormikProps<DatadogLogsInfo | undefined>
  sourceData: any
}
