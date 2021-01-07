import React from 'react'
import {
  IconName,
  Formik,
  Button,
  getMultiTypeFromValue,
  MultiTypeInputType,
  SelectOption,
  Accordion
} from '@wings-software/uicore'
import * as Yup from 'yup'
import type { FormikProps } from 'formik'
import { yupToFormErrors } from 'formik'
import { v4 as uuid } from 'uuid'
import { isEmpty } from 'lodash-es'

import { StepViewType } from '@pipeline/exports'
import type { InputSetData } from '@pipeline/exports'
import { useStrings, UseStringsReturn } from 'framework/exports'

import { getDurationValidationSchema } from '@common/components/MultiTypeDuration/MultiTypeDuration'

import { StepType } from '../../PipelineStepInterface'
import { PipelineStep } from '../../PipelineStep'
import HttpStepBase, { httpStepType } from './HttpStepBase'
import ResponseMapping from './ResponseMapping'
import HttpInputSetStep from './HttpInputSetStep'
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
  readonly?: boolean
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
          timeout: getDurationValidationSchema({ minimum: '10s' }).required(getString('validation.timeout10SecMinimum'))
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
    stepViewType?: StepViewType,
    inputSetData?: InputSetData<HttpStepData>
  ): JSX.Element {
    if (stepViewType === StepViewType.InputSet || stepViewType === StepViewType.DeploymentForm) {
      return (
        <HttpInputSetStep
          initialValues={this.processInitialValues(initialValues)}
          onUpdate={data => onUpdate?.(this.processFormData(data))}
          stepViewType={stepViewType}
          readonly={!!inputSetData?.readonly}
          template={inputSetData?.template}
        />
      )
    }

    return (
      <HttpStepWidget
        initialValues={this.processInitialValues(initialValues)}
        onUpdate={data => onUpdate?.(this.processFormData(data))}
        stepViewType={stepViewType}
        readonly={!!inputSetData?.readonly}
      />
    )
  }

  protected type = StepType.HTTP
  protected stepName = 'Http Step'
  protected stepIcon: IconName = 'http-step'

  validateInputSet(data: HttpStepData, template: HttpStepData, getString?: UseStringsReturn['getString']): object {
    const errors = { spec: {} } as any

    /* istanbul ignore else */
    if (getMultiTypeFromValue(template?.spec?.url) === MultiTypeInputType.RUNTIME && isEmpty(data?.spec?.url)) {
      errors.spec.url = getString?.('fieldRequired', { field: 'URL' })
    }

    /* istanbul ignore else */
    if (getMultiTypeFromValue(template?.spec?.method) === MultiTypeInputType.RUNTIME && isEmpty(data?.spec?.method)) {
      errors.spec.method = getString?.('fieldRequired', { field: 'Method' })
    }

    /* istanbul ignore else */
    if (
      getMultiTypeFromValue(template?.spec?.requestBody) === MultiTypeInputType.RUNTIME &&
      isEmpty(data?.spec?.requestBody)
    ) {
      errors.spec.requestBody = getString?.('fieldRequired', { field: 'Request Body' })
    }

    /* istanbul ignore else */
    if (getMultiTypeFromValue(template?.spec?.timeout) === MultiTypeInputType.RUNTIME) {
      const timeout = Yup.object().shape({
        timeout: getDurationValidationSchema({ minimum: '10s' }).required(getString?.('validation.timeout10SecMinimum'))
      })

      try {
        timeout.validateSync(data.spec)
      } catch (e) {
        /* istanbul ignore else */
        if (e instanceof Yup.ValidationError) {
          const err = yupToFormErrors(e)

          Object.assign(errors.spec, err)
        }
      }
    }

    /* istanbul ignore else */
    if (isEmpty(errors.spec)) {
      delete errors.spec
    }

    return errors
  }
  protected defaultValues: HttpStepData = {
    identifier: '',
    spec: {
      url: '',
      method: httpStepType[0].value as string,
      timeout: '10s'
    }
  }

  private processInitialValues(initialValues: HttpStepData): HttpStepFormData {
    return {
      ...initialValues,
      spec: {
        ...initialValues.spec,
        method: getMultiTypeFromValue(initialValues.spec?.method as string)
          ? (initialValues.spec?.method as string)
          : httpStepType.find(step => step.value === initialValues.spec.method),
        headers:
          getMultiTypeFromValue(initialValues.spec?.headers as string) === MultiTypeInputType.RUNTIME
            ? (initialValues.spec?.headers as string)
            : Array.isArray(initialValues.spec?.headers)
            ? initialValues.spec.headers.map((header: Omit<HttpStepHeader, 'id'>) => ({
                ...header,
                id: uuid()
              }))
            : [{ key: '', value: '', id: uuid() }],
        outputVariables:
          getMultiTypeFromValue(initialValues.spec?.outputVariables as string) === MultiTypeInputType.RUNTIME
            ? (initialValues.spec?.outputVariables as string)
            : Array.isArray(initialValues.spec?.outputVariables)
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
