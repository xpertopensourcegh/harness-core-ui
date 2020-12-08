import React from 'react'
import { SelectOption, IconName, Formik, FormInput, Button, DurationInput } from '@wings-software/uikit'
import * as Yup from 'yup'
import { get } from 'lodash-es'
import type { StepViewType } from '@pipeline/exports'
import type { HttpStepInfo, StepElement } from 'services/cd-ng'
import { StepType } from '../../PipelineStepInterface'
import i18n from './HttpStep.i18n'
import { PipelineStep } from '../../PipelineStep'
import stepCss from '../Steps.module.scss'

export interface HttpStepData extends StepElement {
  spec: HttpStepInfo
}

const httpStepType: SelectOption[] = [
  { value: 'GET', label: 'GET' },
  { value: 'POST', label: 'POST' },
  { value: 'PUT', label: 'PUT' },
  { value: 'DELETE', label: 'DELETE' },
  { value: 'HEAD', label: 'HEAD' },
  { value: 'OPTIONS', label: 'OPTIONS' }
]

interface HttpStepWidgetProps {
  initialValues: HttpStepData
  onUpdate?: (data: HttpStepData) => void
  stepViewType?: StepViewType
}

const HttpStepWidget: React.FC<HttpStepWidgetProps> = ({ initialValues, onUpdate }): JSX.Element => {
  return (
    <>
      <Formik<HttpStepData>
        onSubmit={values => {
          onUpdate?.(values)
        }}
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          name: Yup.string().required(i18n.stepNameRequired),
          spec: Yup.object().shape({
            url: Yup.string().required(i18n.urlRequired),
            socketTimeoutMillis: Yup.number().required(i18n.timeoutRequired).min(9999, i18n.timeoutMinimum)
          })
        })}
      >
        {({ submitForm }) => {
          return (
            <>
              <FormInput.InputWithIdentifier inputLabel={i18n.displayName} />
              <FormInput.Text name="spec.url" label={i18n.url} />
              <FormInput.Select items={httpStepType} label={i18n.method} name="spec.method" />
              <FormInput.TextArea name="spec.body" label={i18n.body} />
              <FormInput.TextArea name="spec.header" label={i18n.header} />
              <FormInput.CustomRender
                name="spec.socketTimeoutMillis"
                className={stepCss.duration}
                label={i18n.socketTimeoutMillis}
                render={formik => {
                  return (
                    <DurationInput
                      value={get(formik.values, 'spec.socketTimeoutMillis')}
                      onChange={time => formik.setFieldValue('spec.socketTimeoutMillis', time)}
                    />
                  )
                }}
              />
              <Button intent="primary" text={i18n.submit} onClick={submitForm} />
            </>
          )
        }}
      </Formik>
    </>
  )
}

export class HttpStep extends PipelineStep<HttpStepData> {
  renderStep(
    initialValues: HttpStepData,
    onUpdate?: (data: HttpStepData) => void,
    stepViewType?: StepViewType
  ): JSX.Element {
    return <HttpStepWidget initialValues={initialValues} onUpdate={onUpdate} stepViewType={stepViewType} />
  }

  protected type = StepType.HTTP
  protected stepName = i18n.httpStep
  protected stepIcon: IconName = 'http-step'

  protected defaultValues: HttpStepData = {
    identifier: '',
    spec: {
      method: httpStepType[0].value as string,
      socketTimeoutMillis: 10000
    }
  }
}
