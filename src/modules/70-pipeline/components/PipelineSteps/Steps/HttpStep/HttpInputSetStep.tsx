import React from 'react'
import { getMultiTypeFromValue, MultiTypeInputType, SelectOption, FormInput } from '@wings-software/uicore'
import { FormGroup } from '@blueprintjs/core'

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
}

export default function HttpInputSetStep(props: HttpInputSetStepProps): React.ReactElement {
  const { template, onUpdate, initialValues } = props
  const { getString } = useStrings()

  return (
    <React.Fragment>
      {getMultiTypeFromValue(template?.spec?.url) === MultiTypeInputType.RUNTIME ? (
        <FormGroup label={getString('UrlLabel')}>
          <FormInput.Text
            name="spec.url"
            onChange={(event: React.SyntheticEvent<HTMLInputElement>) => {
              onUpdate?.({ ...initialValues, spec: { ...initialValues.spec, url: event.currentTarget.value } })
            }}
          />
        </FormGroup>
      ) : null}
      {getMultiTypeFromValue(template?.spec?.method) === MultiTypeInputType.RUNTIME ? (
        <FormGroup label={getString('methodLabel')}>
          <FormInput.Select
            name="spec.method"
            items={httpStepType}
            onChange={(opt: SelectOption) => {
              onUpdate?.({ ...initialValues, spec: { ...initialValues.spec, method: opt.value.toString() } })
            }}
          />
        </FormGroup>
      ) : null}
      {getMultiTypeFromValue(template?.spec?.requestBody) === MultiTypeInputType.RUNTIME ? (
        <FormGroup label={getString('requestBodyLabel')}>
          <FormInput.TextArea
            name="spec.requestBody"
            style={{ resize: 'vertical' }}
            onChange={(event: React.SyntheticEvent<HTMLTextAreaElement>) => {
              onUpdate?.({ ...initialValues, spec: { ...initialValues.spec, requestBody: event.currentTarget.value } })
            }}
          />
        </FormGroup>
      ) : null}
      {getMultiTypeFromValue(template?.spec?.timeout) === MultiTypeInputType.RUNTIME ? (
        <FormGroup label={getString('pipelineSteps.timeoutLabel')}>
          <DurationInputFieldForInputSet
            name="spec.timeout"
            onChange={(timeout: string) => {
              onUpdate?.({ ...initialValues, spec: { ...initialValues.spec, timeout } })
            }}
          />
        </FormGroup>
      ) : null}
    </React.Fragment>
  )
}
