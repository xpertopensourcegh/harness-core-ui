import type { FormikContext } from 'formik'
import { get, isPlainObject } from 'lodash-es'

export const errorCheck = (name: string, formik?: FormikContext<any>): boolean | '' | 0 | undefined =>
  ((get(formik?.touched, name) || (formik?.submitCount && formik?.submitCount > 0)) &&
    get(formik?.errors, name) &&
    !isPlainObject(get(formik?.errors, name))) as boolean
