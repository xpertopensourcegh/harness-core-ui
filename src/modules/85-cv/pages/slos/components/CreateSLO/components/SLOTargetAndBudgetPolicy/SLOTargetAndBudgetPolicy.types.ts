import type { FormikProps } from 'formik'
import type { SLOForm } from '../../CreateSLO.types'

export interface SLOTargetAndBudgetPolicyProps {
  formikProps: FormikProps<SLOForm>
  children: JSX.Element
}
