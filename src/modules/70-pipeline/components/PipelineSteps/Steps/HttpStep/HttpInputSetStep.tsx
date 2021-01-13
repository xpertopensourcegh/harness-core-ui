import React from 'react'
import { getMultiTypeFromValue, MultiTypeInputType, SelectOption, FormInput } from '@wings-software/uicore'
import { isEmpty } from 'lodash-es'

import { useStrings } from 'framework/exports'
import type { StepViewType } from '@pipeline/exports'
import { DurationInputFieldForInputSet } from '@common/components/MultiTypeDuration/MultiTypeDuration'

import type { HttpStepFormData, HttpStepData } from './types'
import { httpStepType } from './HttpStepBase'

export interface HttpInputSetStepProps {
  initialValues: HttpStepFormData
  onUpdate?: (data: HttpStepFormData) => void
  stepViewType?: StepViewType
  readonly?: boolean
  template?: HttpStepData
  path: string
}

export default function HttpInputSetStep(props: HttpInputSetStepProps): React.ReactElement {
  const { template, onUpdate, initialValues, path, readonly } = props
  const { getString } = useStrings()
  const prefix = isEmpty(path) ? '' : `${path}.`

  return (
    <React.Fragment>
      {getMultiTypeFromValue(template?.spec?.url) === MultiTypeInputType.RUNTIME ? (
        <FormInput.Text label={getString('UrlLabel')} name={`${prefix}spec.url`} disabled={readonly} />
      ) : null}
      {getMultiTypeFromValue(template?.spec?.method) === MultiTypeInputType.RUNTIME ? (
        <FormInput.Select
          label={getString('methodLabel')}
          name={`${prefix}spec.method`}
          items={httpStepType}
          onChange={(opt: SelectOption) => {
            onUpdate?.({ ...initialValues, spec: { ...initialValues.spec, method: opt.value.toString() } })
          }}
          disabled={readonly}
        />
      ) : null}
      {getMultiTypeFromValue(template?.spec?.requestBody) === MultiTypeInputType.RUNTIME ? (
        <FormInput.TextArea
          label={getString('requestBodyLabel')}
          name={`${prefix}spec.requestBody`}
          style={{ resize: 'vertical' }}
          disabled={readonly}
        />
      ) : null}
      {getMultiTypeFromValue(template?.spec?.assertion) === MultiTypeInputType.RUNTIME ? (
        <FormInput.Text label={getString('assertionLabel')} name={`${prefix}spec.assertion`} disabled={readonly} />
      ) : null}
      {getMultiTypeFromValue(template?.spec?.timeout) === MultiTypeInputType.RUNTIME ? (
        <DurationInputFieldForInputSet
          label={getString('pipelineSteps.timeoutLabel')}
          name={`${prefix}spec.timeout`}
          disabled={readonly}
        />
      ) : null}
    </React.Fragment>
  )
}
