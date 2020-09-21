import React from 'react'
import { SelectOption, IconName, Text, Formik, FormInput, Button, DurationInput } from '@wings-software/uikit'
import * as Yup from 'yup'
import { get } from 'lodash-es'
import { Step, StepViewType } from 'modules/common/exports'
import type { HttpStepInfo, StepElement } from 'services/cd-ng'
import { StepType } from '../../PipelineStepInterface'
import i18n from './HttpStep.i18n'
import stepCss from '../Steps.module.scss'

export interface HttpStepData extends Omit<StepElement, 'spec'> {
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
      <Text className={stepCss.boldLabel} font={{ size: 'medium' }}>
        {i18n.httpStep}
      </Text>
      <Formik<HttpStepData>
        onSubmit={values => {
          onUpdate?.(values)
        }}
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          name: Yup.string().required(i18n.stepNameRequired)
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

export class HttpStep extends Step<HttpStepData> {
  renderStep(
    initialValues: HttpStepData,
    onUpdate?: (data: HttpStepData) => void,
    stepViewType?: StepViewType
  ): JSX.Element {
    return <HttpStepWidget initialValues={initialValues} onUpdate={onUpdate} stepViewType={stepViewType} />
  }

  protected type = StepType.HTTP
  protected stepName = i18n.httpStep
  protected stepIcon: IconName = 'command-http'

  protected defaultValues: HttpStepData = {
    spec: {
      method: httpStepType[0].value as string,
      socketTimeoutMillis: 60000
    }
  }
}
