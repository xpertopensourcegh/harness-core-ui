import { getMultiTypeFromValue, MultiTypeInputType, SelectOption } from '@wings-software/uicore'
import { isEmpty, isNil, omitBy, set } from 'lodash-es'
import { yupToFormErrors } from 'formik'
import * as Yup from 'yup'
import type { UseStringsReturn } from 'framework/exports'
import { getDurationValidationSchema } from '@common/components/MultiTypeDuration/MultiTypeDuration'
import type { ContinousVerificationData, spec } from './types'
import {
  VerificationSensitivityOptions,
  durationOptions,
  baseLineOptions,
  trafficSplitPercentageOptions
} from './constants'

/**
 * checks if a field is a runtime input.
 * @param field
 * @returns boolean
 */
export function checkIfRunTimeInput(field: string | SelectOption | undefined): boolean {
  return getMultiTypeFromValue(field) === MultiTypeInputType.RUNTIME
}

/**
 * validates a particular field for errors.
 * @param fieldValue
 * @param fieldKey
 * @param data
 * @param errors
 * @param getString
 */
export function validateField(
  fieldValue: string,
  fieldKey: string,
  data: ContinousVerificationData,
  errors: any,
  getString: UseStringsReturn['getString']
): void {
  if (checkIfRunTimeInput(fieldValue) && isEmpty(data?.spec?.spec && data?.spec?.spec[fieldKey])) {
    set(errors, `spec.spec.${fieldKey}`, getString('fieldRequired', { field: fieldKey }))
  }
}

/**
 * validates timeout field.
 * @param template
 * @param getString
 * @param data
 * @param errors
 */
export function validateTimeout(
  template: ContinousVerificationData,
  getString: UseStringsReturn['getString'],
  data: ContinousVerificationData,
  errors: any
): void {
  if (checkIfRunTimeInput(template?.timeout)) {
    const timeout = Yup.object().shape({
      timeout: getDurationValidationSchema({ minimum: '10s' }).required(getString?.('validation.timeout10SecMinimum'))
    })

    try {
      timeout.validateSync(data)
    } catch (e) {
      if (e instanceof Yup.ValidationError) {
        const err = yupToFormErrors(e)
        Object.assign(errors, err)
      }
    }
  }
}

/**
 * returns yaml data for spec field.
 * @param specInfo
 * @returns spec
 */
export function getSpecYamlData(specInfo: spec | undefined): spec {
  const validspec = omitBy(specInfo, isNil)

  Object.keys(validspec).map((key: string) => {
    validspec[key] = validspec[key].value ? validspec[key].value : validspec[key]
  })

  return validspec
}

/**
 * returns forms data for spec field.
 * @param specInfo
 * @returns spec
 */
export function getSpecFormData(specInfo: spec | undefined): spec {
  const validspec: spec | undefined = { ...specInfo }
  if (specInfo) {
    Object.keys(specInfo).map((key: string) => {
      switch (key) {
        case 'sensitivity':
          setFieldData(validspec, 'sensitivity', VerificationSensitivityOptions)
          break
        case 'duration':
          setFieldData(validspec, 'duration', durationOptions)
          break
        case 'baseline':
          setFieldData(validspec, 'baseline', baseLineOptions)
          break
        case 'trafficsplit':
          setFieldData(validspec, 'trafficsplit', trafficSplitPercentageOptions)
          break
        default:
      }
    })
  }
  return validspec
}

/**
 * sets particular field data
 * @param validspec
 * @param field
 * @param options
 */
export function setFieldData(validspec: spec | undefined, field: string, fieldOptions: SelectOption[]): void {
  if (validspec && validspec[field]) {
    validspec[field] = fieldOptions.find((el: SelectOption) => el.value === (validspec && validspec[field]))
  }
}
