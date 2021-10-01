import { getMultiTypeFromValue, MultiTypeInputType } from '@wings-software/uicore'
import * as Yup from 'yup'
import isEmpty from 'lodash/isEmpty'
import type { UseStringsReturn } from 'framework/strings'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import { IdentifierSchema, NameSchema } from '@common/utils/Validation'

const namespaceRegex = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/
const releaseNameRegex = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/

export function getNameSpaceSchema(
  getString: UseStringsReturn['getString'],
  isRequired = true
): Yup.StringSchema<string | undefined> {
  const namespaceSchema = Yup.string().test('namespace', getString('cd.namespaceValidation'), function (value) {
    if (getMultiTypeFromValue(value) !== MultiTypeInputType.FIXED || isEmpty(value)) {
      return true
    }
    return namespaceRegex.test(value)
  })
  if (isRequired) {
    return namespaceSchema.required(getString('fieldRequired', { field: getString('common.namespace') }))
  }
  return namespaceSchema
}
export function getReleaseNameSchema(
  getString: UseStringsReturn['getString'],
  isRequired = true
): Yup.StringSchema<string | undefined> {
  const releaseNameSchema = Yup.string().test('releaseName', getString('cd.releaseNameValidation'), function (value) {
    if (getMultiTypeFromValue(value) !== MultiTypeInputType.FIXED || isEmpty(value)) {
      return true
    }
    return releaseNameRegex.test(value)
  })
  if (isRequired) {
    return releaseNameSchema.required(getString('fieldRequired', { field: getString('common.releaseName') }))
  }
  return releaseNameSchema
}
export function getNameAndIdentifierSchema(
  getString: UseStringsReturn['getString'],
  stepViewType?: StepViewType
): { [key: string]: Yup.Schema<string | undefined> } {
  return stepViewType !== StepViewType.Template
    ? {
        name: NameSchema({ requiredErrorMsg: getString('pipelineSteps.stepNameRequired') }),
        identifier: IdentifierSchema()
      }
    : {}
}
