import type { FormikProps } from 'formik'
import type { FilterDTO } from 'services/cd-ng'

export interface FilterInterface {
  name: string
  visible: FilterDTO['filterVisibility']
  identifier: string
}

export interface FilterDataInterface<T, U> {
  formValues: FormikProps<T>['initialValues']
  metadata: U
}
