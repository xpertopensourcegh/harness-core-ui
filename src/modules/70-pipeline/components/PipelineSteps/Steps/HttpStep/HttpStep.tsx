import React from 'react'
import {
  IconName,
  Formik,
  Button,
  getMultiTypeFromValue,
  MultiTypeInputType,
  SelectOption
} from '@wings-software/uikit'
import * as Yup from 'yup'
import type { FormikProps } from 'formik'
import { v4 as uuid } from 'uuid'

import type { StepViewType } from '@pipeline/exports'
import Accordion from '@common/components/Accordion/Accordion'
import { useStrings } from 'framework/exports'

import { StepType } from '../../PipelineStepInterface'
import { PipelineStep } from '../../PipelineStep'
import HttpStepBase, { httpStepType } from './HttpStepBase'
import ResponseMapping from './ResponseMapping'
import type { HttpStepData, HttpStepFormData, HttpStepOutputVariable, HttpStepHeader } from './types'
import stepCss from '../Steps.module.scss'

/**
 * Spec
 * https://harness.atlassian.net/wiki/spaces/CDNG/pages/1160446867/Http+Step
 */

interface HttpStepWidgetProps {
  initialValues: HttpStepFormData
  onUpdate?: (data: HttpStepFormData) => void
  stepViewType?: StepViewType
}

const HttpStepWidget: React.FC<HttpStepWidgetProps> = ({ initialValues, onUpdate }): JSX.Element => {
  const { getString } = useStrings()

  return (
    <Formik<HttpStepFormData>
      onSubmit={values => {
        onUpdate?.(values)
      }}
      initialValues={initialValues}
      validationSchema={Yup.object().shape({
        name: Yup.string().required(getString('pipelineSteps.stepNameRequired')),
        spec: Yup.object().shape({
          url: Yup.string().required(getString('validation.UrlRequired')),
          socketTimeoutMillis: Yup.number()
            .required(getString('pipelineSteps.timeoutRequired'))
            .min(9999, getString('validation.timeout10SecMinimum'))
        })
      })}
    >
      {(formik: FormikProps<HttpStepFormData>) => {
        return (
          <React.Fragment>
            <Accordion activeId="step-1" className={stepCss.accordion}>
              <Accordion.Panel id="step-1" summary="Http Step" details={<HttpStepBase formik={formik} />} />
              <Accordion.Panel id="step-2" summary="Response Mapping" details={<ResponseMapping formik={formik} />} />
            </Accordion>
            <Button intent="primary" text={getString('submit')} onClick={formik.submitForm} />
          </React.Fragment>
        )
      }}
    </Formik>
  )
}

export class HttpStep extends PipelineStep<HttpStepData> {
  renderStep(
    this: HttpStep,
    initialValues: HttpStepData,
    onUpdate?: (data: HttpStepData) => void,
    stepViewType?: StepViewType
  ): JSX.Element {
    return (
      <HttpStepWidget
        initialValues={this.processInitialValues(initialValues)}
        onUpdate={data => onUpdate?.(this.processFormData(data))}
        stepViewType={stepViewType}
      />
    )
  }

  protected type = StepType.HTTP
  protected stepName = 'Http Step'
  protected stepIcon: IconName = 'http-step'

  protected defaultValues: HttpStepData = {
    identifier: '',
    spec: {
      url: '',
      method: httpStepType[0].value as string,
      socketTimeoutMillis: 10000
    }
  }

  private processInitialValues(initialValues: HttpStepData): HttpStepFormData {
    return {
      ...initialValues,
      spec: {
        ...initialValues.spec,
        method: getMultiTypeFromValue(initialValues.spec.method as string)
          ? (initialValues.spec.method as string)
          : httpStepType.find(step => step.value === initialValues.spec.method),
        headers:
          getMultiTypeFromValue(initialValues.spec.headers as string) === MultiTypeInputType.RUNTIME
            ? (initialValues.spec.headers as string)
            : Array.isArray(initialValues.spec.headers)
            ? initialValues.spec.headers.map((header: Omit<HttpStepHeader, 'id'>) => ({
                ...header,
                id: uuid()
              }))
            : [{ key: '', value: '', id: uuid() }],
        outputVariables:
          getMultiTypeFromValue(initialValues.spec.outputVariables as string) === MultiTypeInputType.RUNTIME
            ? (initialValues.spec.outputVariables as string)
            : Array.isArray(initialValues.spec.outputVariables)
            ? initialValues.spec.outputVariables.map((variable: Omit<HttpStepOutputVariable, 'id'>) => ({
                ...variable,
                id: uuid()
              }))
            : [{ name: '', type: 'String', value: '', id: uuid() }]
      }
    }
  }

  private processFormData(data: HttpStepFormData): HttpStepData {
    return {
      ...data,
      spec: {
        ...data.spec,
        method: ((data.spec.method as SelectOption)?.value as string) || data.spec.method?.toString(),
        headers:
          getMultiTypeFromValue(data.spec.headers as string) === MultiTypeInputType.RUNTIME
            ? (data.spec.headers as string)
            : Array.isArray(data.spec.headers)
            ? data.spec.headers
                .filter((variable: HttpStepHeader) => variable.value)
                .map(({ id, ...header }: HttpStepHeader) => header)
            : undefined,
        outputVariables:
          getMultiTypeFromValue(data.spec.outputVariables as string) === MultiTypeInputType.RUNTIME
            ? (data.spec.outputVariables as string)
            : Array.isArray(data.spec.outputVariables)
            ? data.spec.outputVariables
                .filter((variable: HttpStepOutputVariable) => variable.value)
                .map(({ id, ...variable }: HttpStepOutputVariable) => variable)
            : undefined
      }
    }
  }
}
