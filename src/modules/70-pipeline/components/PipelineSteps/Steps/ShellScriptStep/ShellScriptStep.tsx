import React from 'react'
import { IconName, Formik, Button, getMultiTypeFromValue, MultiTypeInputType, Accordion } from '@wings-software/uicore'
import { isEmpty, set } from 'lodash-es'
import * as Yup from 'yup'
import type { FormikProps } from 'formik'
import { v4 as uuid } from 'uuid'
import { useStrings, UseStringsReturn } from 'framework/exports'
import type { StepProps } from '@pipeline/exports'
import { StepViewType } from '@pipeline/exports'
import { StepFormikFowardRef, setFormikRef } from '@pipeline/components/AbstractSteps/Step'
import { StepType } from '../../PipelineStepInterface'
import i18n from './ShellScriptStep.i18n'
import { PipelineStep } from '../../PipelineStep'
import BaseShellScript, { shellScriptType } from './BaseShellScript'
import ShellScriptInput from './ShellScriptInput'
import ExecutionTarget from './ExecutionTarget'
import ShellScriptOutput from './ShellScriptOutput'
import type { ShellScriptData, ShellScriptFormData } from './shellScriptTypes'
import ShellScriptInputSetStep from './ShellScriptInputSetStep'
import stepCss from '../Steps.module.scss'

/**
 * Spec
 * https://harness.atlassian.net/wiki/spaces/CDNG/pages/1203634286/Shell+Script
 */

interface ShellScriptWidgetProps {
  initialValues: ShellScriptFormData
  onUpdate?: (data: ShellScriptFormData) => void
  stepViewType?: StepViewType
}

function ShellScriptWidget(
  { initialValues, onUpdate }: ShellScriptWidgetProps,
  formikRef: StepFormikFowardRef
): JSX.Element {
  const { getString } = useStrings()

  const defaultSSHSchema = Yup.object().shape({
    name: Yup.string().required(getString('pipelineSteps.stepNameRequired')),
    spec: Yup.object().shape({
      shell: Yup.string().required(getString('validation.scriptTypeRequired')),
      source: Yup.object().shape({
        spec: Yup.object().shape({
          script: Yup.string().required(getString('validation.scriptTypeRequired'))
        })
      })
    })
  })

  const values: any = {
    ...initialValues,
    spec: {
      ...initialValues.spec,
      executionTarget: {
        ...initialValues.spec.executionTarget,
        connectorRef: undefined
      }
    }
  }

  const validationSchema = defaultSSHSchema

  return (
    <Formik<ShellScriptFormData>
      onSubmit={submit => {
        onUpdate?.(submit)
      }}
      initialValues={values}
      validationSchema={validationSchema}
    >
      {(formik: FormikProps<ShellScriptFormData>) => {
        // this is required
        setFormikRef(formikRef, formik)

        return (
          <>
            <Accordion activeId="step-1" className={stepCss.accordion}>
              <Accordion.Panel id="step-1" summary="Shell Script" details={<BaseShellScript formik={formik} />} />
              <Accordion.Panel
                id="step-2"
                summary="Script Input Variables"
                details={<ShellScriptInput formik={formik} />}
              />
              <Accordion.Panel
                id="step-4"
                summary="Script Output Variables"
                details={<ShellScriptOutput formik={formik} />}
              />
              <Accordion.Panel id="step-3" summary="Execution Target" details={<ExecutionTarget formik={formik} />} />
            </Accordion>
            <div className={stepCss.actionsPanel}>
              <Button intent="primary" text={getString('submit')} onClick={formik.submitForm} />
            </div>
          </>
        )
      }}
    </Formik>
  )
}

const ShellScriptWidgetWithRef = React.forwardRef(ShellScriptWidget)

export class ShellScriptStep extends PipelineStep<ShellScriptData> {
  renderStep(props: StepProps<ShellScriptData>): JSX.Element {
    const { initialValues, onUpdate, stepViewType, inputSetData, formikRef } = props

    if (stepViewType === StepViewType.InputSet || stepViewType === StepViewType.DeploymentForm) {
      return (
        <ShellScriptInputSetStep
          initialValues={this.getInitialValues(initialValues)}
          onUpdate={data => onUpdate?.(this.processFormData(data))}
          stepViewType={stepViewType}
          readonly={!!inputSetData?.readonly}
          template={inputSetData?.template}
          path={inputSetData?.path || ''}
        />
      )
    }
    return (
      <ShellScriptWidgetWithRef
        initialValues={this.getInitialValues(initialValues)}
        onUpdate={data => onUpdate?.(this.processFormData(data))}
        stepViewType={stepViewType}
        ref={formikRef}
      />
    )
  }

  validateInputSet(
    data: ShellScriptData,
    template: ShellScriptData,
    getString?: UseStringsReturn['getString']
  ): object {
    const errors = {} as any

    /* istanbul ignore else */
    if (
      getMultiTypeFromValue(template?.spec?.source?.spec?.script) === MultiTypeInputType.RUNTIME &&
      isEmpty(data?.spec?.source?.spec?.script)
    ) {
      set(errors, 'spec.source.spec.script', getString?.('fieldRequired', { field: 'Script' }))
    }

    /* istanbul ignore else */
    if (
      getMultiTypeFromValue(template?.spec?.executionTarget?.host) === MultiTypeInputType.RUNTIME &&
      isEmpty(data?.spec?.executionTarget?.host)
    ) {
      set(errors, 'spec.executionTarget.host', getString?.('fieldRequired', { field: 'Target Host' }))
    }

    /* istanbul ignore else */
    if (
      getMultiTypeFromValue(template?.spec?.executionTarget?.connectorRef) === MultiTypeInputType.RUNTIME &&
      isEmpty(data?.spec?.executionTarget?.connectorRef)
    ) {
      set(
        errors,
        'spec.executionTarget.connectorRef',
        getString?.('fieldRequired', { field: 'SSH Connection Attribute' })
      )
    }

    /* istanbul ignore else */
    if (
      getMultiTypeFromValue(template?.spec?.executionTarget?.workingDirectory) === MultiTypeInputType.RUNTIME &&
      isEmpty(data?.spec?.executionTarget?.workingDirectory)
    ) {
      set(errors, 'spec.executionTarget.workingDirectory', getString?.('fieldRequired', { field: 'Working Directory' }))
    }

    return errors
  }

  protected type = StepType.SHELLSCRIPT
  protected stepName = i18n.shellScriptStep
  protected stepIcon: IconName = 'command-shell-script'

  protected defaultValues: ShellScriptData = {
    identifier: '',
    spec: {
      shell: shellScriptType[0].value,
      onDelegate: 'targethost',
      source: {
        type: 'Inline',
        spec: {
          script: ''
        }
      }
    }
  }

  private getInitialValues(initialValues: ShellScriptData): ShellScriptFormData {
    return {
      ...initialValues,
      spec: {
        ...initialValues.spec,
        shell: 'Bash',
        onDelegate: initialValues.spec?.onDelegate ? 'delegate' : 'targethost',

        environmentVariables: Array.isArray(initialValues.spec?.environmentVariables)
          ? initialValues.spec?.environmentVariables.map(variable => ({
              ...variable,
              id: uuid()
            }))
          : [{ name: '', type: 'String', value: '', id: uuid() }],

        outputVariables: Array.isArray(initialValues.spec?.outputVariables)
          ? initialValues.spec?.outputVariables.map(variable => ({
              ...variable,
              id: uuid()
            }))
          : [{ name: '', type: 'String', value: '', id: uuid() }]
      }
    }
  }

  private processFormData(data: ShellScriptFormData): ShellScriptData {
    return {
      ...data,
      spec: {
        ...data.spec,
        onDelegate: data.spec?.onDelegate === 'targethost' ? false : true,

        source: {
          ...data.spec?.source,
          spec: {
            ...data.spec?.source?.spec,
            script: data.spec?.source?.spec?.script
          }
        },

        executionTarget: {
          ...data.spec?.executionTarget,
          connectorRef:
            (data.spec?.executionTarget?.connectorRef?.value as string) ||
            data.spec?.executionTarget?.connectorRef?.toString()
        },

        environmentVariables: Array.isArray(data.spec?.environmentVariables)
          ? data.spec?.environmentVariables.filter(variable => variable.value).map(({ id, ...variable }) => variable)
          : undefined,

        outputVariables: Array.isArray(data.spec?.outputVariables)
          ? data.spec?.outputVariables.filter(variable => variable.value).map(({ id, ...variable }) => variable)
          : undefined
      }
    }
  }
}
