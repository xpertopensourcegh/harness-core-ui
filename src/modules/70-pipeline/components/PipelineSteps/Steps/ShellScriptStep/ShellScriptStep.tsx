import React from 'react'
import { useParams } from 'react-router-dom'
import { IconName, Formik, Button, getMultiTypeFromValue, MultiTypeInputType } from '@wings-software/uicore'
import { isEmpty } from 'lodash-es'
import * as Yup from 'yup'
import type { FormikProps } from 'formik'
import { v4 as uuid } from 'uuid'
import { ConnectorInfoDTO, useGetConnector } from 'services/cd-ng'
import { useStrings } from 'framework/exports'
import type { StepViewType } from '@pipeline/exports'
import Accordion from '@common/components/Accordion/Accordion'
import {
  getIdentifierFromValue,
  getScopeFromDTO,
  getScopeFromValue
} from '@common/components/EntityReference/EntityReference'
import type { PipelineType } from '@common/interfaces/RouteInterfaces'
import { Scope } from '@common/interfaces/SecretsInterface'
import { StepType } from '../../PipelineStepInterface'
import i18n from './ShellScriptStep.i18n'
import { PipelineStep } from '../../PipelineStep'
import BaseShellScript, { shellScriptType } from './BaseShellScript'
import ShellScriptInput from './ShellScriptInput'
import ExecutionTarget from './ExecutionTarget'
import ShellScriptOutput from './ShellScriptOutput'
import type { ShellScriptData, ShellScriptFormData } from './shellScriptTypes'
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

const ShellScriptWidget: React.FC<ShellScriptWidgetProps> = ({ initialValues, onUpdate }): JSX.Element => {
  const { accountId, projectIdentifier, orgIdentifier } = useParams<
    PipelineType<{
      projectIdentifier: string
      orgIdentifier: string
      accountId: string
    }>
  >()

  const connectorRef = getIdentifierFromValue(initialValues.spec.executionTarget?.connectorRef || '')
  const initialScope = getScopeFromValue(initialValues.spec.executionTarget?.connectorRef || '')

  const { data: connector, loading, refetch: fetchConnector } = useGetConnector({
    identifier: connectorRef,
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier: initialScope === Scope.ORG || initialScope === Scope.PROJECT ? orgIdentifier : undefined,
      projectIdentifier: initialScope === Scope.PROJECT ? projectIdentifier : undefined
    },
    lazy: true
  })

  React.useEffect(() => {
    if (
      !isEmpty(initialValues.spec.executionTarget?.connectorRef) &&
      getMultiTypeFromValue(initialValues.spec.executionTarget?.connectorRef || '') === MultiTypeInputType.FIXED
    ) {
      fetchConnector()
    }
  }, [initialValues.spec.executionTarget?.connectorRef])

  const values: any = JSON.parse(JSON.stringify(initialValues))
  values.spec.executionTarget.connectorRef = undefined

  if (
    connector?.data?.connector &&
    getMultiTypeFromValue(initialValues.spec.executionTarget?.connectorRef || '') === MultiTypeInputType.FIXED
  ) {
    const scope = getScopeFromDTO<ConnectorInfoDTO>(connector?.data?.connector)

    values.spec.executionTarget.connectorRef = {
      label: connector?.data?.connector.name || '',
      value: `${scope !== Scope.PROJECT ? `${scope}.` : ''}${connector?.data?.connector.identifier}`,
      scope: scope,
      live: connector?.data?.status?.status === 'SUCCESS',
      connector: connector?.data?.connector
    }
  } else {
    values.spec.executionTarget.connectorRef = initialValues.spec.executionTarget?.connectorRef
  }

  const { getString } = useStrings()

  return (
    <Formik<ShellScriptFormData>
      onSubmit={submit => {
        onUpdate?.(submit)
      }}
      initialValues={values}
      validationSchema={Yup.object().shape({
        name: Yup.string().required(getString('pipelineSteps.stepNameRequired')),
        spec: Yup.object().shape({
          shell: Yup.string().required(getString('validation.scriptTypeRequired'))
        })
      })}
    >
      {(formik: FormikProps<ShellScriptFormData>) => {
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
                id="step-3"
                summary="Execution Target"
                details={<ExecutionTarget formik={formik} loading={loading} />}
              />
              <Accordion.Panel
                id="step-4"
                summary="Script Output Variables"
                details={<ShellScriptOutput formik={formik} />}
              />
            </Accordion>
            <Button intent="primary" text={getString('submit')} onClick={formik.submitForm} />
          </>
        )
      }}
    </Formik>
  )
}

export class ShellScriptStep extends PipelineStep<ShellScriptData> {
  renderStep(
    initialValues: ShellScriptData,
    onUpdate?: (data: ShellScriptData) => void,
    stepViewType?: StepViewType
  ): JSX.Element {
    return (
      <ShellScriptWidget
        initialValues={this.getInitialValues(initialValues)}
        onUpdate={data => onUpdate?.(this.processFormData(data))}
        stepViewType={stepViewType}
      />
    )
  }

  validateInputSet(): object {
    return {}
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
      },
      executionTarget: {
        host: '',
        connectorRef: '',
        workingDirectory: ''
      }
    }
  }

  private getInitialValues(initialValues: ShellScriptData): ShellScriptFormData {
    return {
      ...initialValues,
      spec: {
        ...initialValues.spec,

        onDelegate: initialValues.spec.onDelegate ? 'targethost' : 'delegate',

        source: {
          ...initialValues.spec.source,
          type: 'Inline',
          spec: {
            ...initialValues.spec.source?.spec,
            script: ''
          }
        },

        executionTarget: {
          ...initialValues.spec.executionTarget,
          host: '',
          connectorRef: '',
          workingDirectory: ''
        },

        environmentVariables: Array.isArray(initialValues.spec.environmentVariables)
          ? initialValues.spec.environmentVariables.map(variable => ({
              ...variable,
              id: uuid()
            }))
          : [{ name: '', type: 'String', value: '', id: uuid() }],

        outputVariables: Array.isArray(initialValues.spec.outputVariables)
          ? initialValues.spec.outputVariables.map(variable => ({
              ...variable,
              id: uuid()
            }))
          : [{ name: '', value: '', id: uuid() }]
      }
    }
  }

  private processFormData(data: ShellScriptFormData): ShellScriptData {
    return {
      ...data,
      spec: {
        ...data.spec,

        executionTarget: {
          ...data.spec.executionTarget,
          connectorRef:
            (data.spec.executionTarget?.connectorRef?.value as string) ||
            data.spec.executionTarget?.connectorRef?.toString()
        },

        environmentVariables: Array.isArray(data.spec.environmentVariables)
          ? data.spec.environmentVariables.filter(variable => variable.value).map(({ id, ...variable }) => variable)
          : undefined,

        outputVariables: Array.isArray(data.spec.outputVariables)
          ? data.spec.outputVariables.filter(variable => variable.value).map(({ id, ...variable }) => variable)
          : undefined
      }
    }
  }
}
