import { FormikContext, isObject } from 'formik'
import { get } from 'lodash-es'

export const errorCheck = (name: string, formik?: FormikContext<any>): boolean | '' | 0 | undefined =>
  (get(formik?.touched, name) || (formik?.submitCount && formik?.submitCount > 0)) &&
  get(formik?.errors, name) &&
  !isObject(get(formik?.errors, name))

export const RUNTIME_INPUT_VALUE = '${input}'
