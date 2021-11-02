import type { FormikProps } from 'formik'
import type { SLIMetricSpec, SLOTargetSpec } from 'services/cv'
import type { SLITypeEnum } from './components/SLI/SLI.constants'

export interface SLOForm {
  name: string
  identifier: string
  description?: string
  tags?: { [key: string]: string }
  userJourneyRef: string
  monitoredServiceRef: string
  healthSourceRef: string
  serviceLevelIndicators: {
    type: SLITypeEnum
    spec: {
      type?: 'Threshold' | 'Ratio'
      spec: SLIMetricSpec
    }
  }
  target: {
    type?: 'Rolling' | 'Calender'
    sloTargetPercentage: number
    spec: SLOTargetSpec
  }
}

export interface CreateSLOFormProps {
  formikProps: FormikProps<SLOForm>
  identifier?: string
}
