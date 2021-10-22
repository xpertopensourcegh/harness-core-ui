import type { FormikProps } from 'formik'
import type { SLOForm } from '../../CreateSLO.types'

export interface SLIProps {
  formikProps: FormikProps<SLOForm>
  children: JSX.Element
}
