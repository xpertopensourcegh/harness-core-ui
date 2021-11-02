import type { FormikProps } from 'formik'
import type { SLOForm } from '../../CreateSLO.types'

export interface SLONameProps {
  formikProps: FormikProps<SLOForm>
  children: JSX.Element
  identifier?: string
}
