import type { FormikProps } from 'formik'
import type { SLOForm } from '../../CreateSLO.types'

export interface SLIProps {
  formikProps: FormikProps<SLOForm>
  children: JSX.Element
}

// PickMetric

export interface PickMetricProps {
  formikProps: SLIProps['formikProps']
}

export enum Comparators {
  LESS = 'less',
  GREATER = 'greater',
  LESS_EQUAL = 'lessOrEqual',
  GREATER_EQUAL = 'greaterOrEqual'
}
