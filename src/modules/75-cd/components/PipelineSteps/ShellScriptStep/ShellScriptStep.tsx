import React from 'react'
import { IconName, Formik, getMultiTypeFromValue, MultiTypeInputType, Accordion } from '@wings-software/uicore'
import { isEmpty, set, get } from 'lodash-es'
import * as Yup from 'yup'
import { FormikProps, yupToFormErrors } from 'formik'
import { v4 as uuid } from 'uuid'
import { CompletionItemKind } from 'vscode-languageserver-types'
import { parse } from 'yaml'
import { useStrings, UseStringsReturn, loggerFor, ModuleName } from 'framework/exports'
import type { StepProps } from '@pipeline/exports'
import { listSecretsV2Promise, SecretResponseWrapper } from 'services/cd-ng'
import { StepViewType } from '@pipeline/exports'
import { StepFormikFowardRef, setFormikRef } from '@pipeline/components/AbstractSteps/Step'
import type { CompletionItemInterface } from '@common/interfaces/YAMLBuilderProps'
import { Scope } from '@common/interfaces/SecretsInterface'
import { getDurationValidationSchema } from '@common/components/MultiTypeDuration/MultiTypeDuration'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import { PipelineStep } from '@pipeline/components/PipelineSteps/PipelineStep'
import i18n from './ShellScriptStep.i18n'
import BaseShellScript, { shellScriptType } from './BaseShellScript'
import ShellScriptInput from './ShellScriptInput'
import ExecutionTarget from './ExecutionTarget'
import ShellScriptOutput from './ShellScriptOutput'
import type { ShellScriptData, ShellScriptFormData } from './shellScriptTypes'
import ShellScriptInputSetStep from './ShellScriptInputSetStep'
import stepCss from '@pipeline/components/PipelineSteps/Steps/Steps.module.scss'
const logger = loggerFor(ModuleName.CD)

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
    timeout: getDurationValidationSchema({ minimum: '10s' }).required(getString('validation.timeout10SecMinimum')),
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
          <Accordion activeId="step-1" className={stepCss.accordion}>
            <Accordion.Panel id="step-1" summary={getString('basic')} details={<BaseShellScript formik={formik} />} />
            <Accordion.Panel
              id="step-2"
              summary={getString('scriptInputVariables')}
              details={<ShellScriptInput formik={formik} />}
            />
            <Accordion.Panel
              id="step-4"
              summary={getString('scriptOutputVariables')}
              details={<ShellScriptOutput formik={formik} />}
            />
            <Accordion.Panel
              id="step-3"
              summary={getString('executionTarget')}
              details={<ExecutionTarget formik={formik} />}
            />
          </Accordion>
        )
      }}
    </Formik>
  )
}

const ShellScriptWidgetWithRef = React.forwardRef(ShellScriptWidget)

const ConnectorRefRegex = /^.+step\.spec\.executionTarget\.connectorRef$/

const getConnectorValue = (connector?: SecretResponseWrapper): string =>
  `${
    connector?.secret?.orgIdentifier && connector?.secret?.projectIdentifier
      ? connector?.secret?.identifier
      : connector?.secret?.orgIdentifier
      ? `${Scope.ORG}.${connector?.secret?.identifier}`
      : `${Scope.ACCOUNT}.${connector?.secret?.identifier}`
  }` || ''

const getConnectorName = (connector?: SecretResponseWrapper): string =>
  `${
    connector?.secret?.orgIdentifier && connector?.secret?.projectIdentifier
      ? `${connector?.secret?.type}: ${connector?.secret?.name}`
      : connector?.secret?.orgIdentifier
      ? `${connector?.secret?.type}[Org]: ${connector?.secret?.name}`
      : `${connector?.secret?.type}[Account]: ${connector?.secret?.name}`
  }` || ''

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

    if (getMultiTypeFromValue(template?.timeout) === MultiTypeInputType.RUNTIME) {
      const timeout = Yup.object().shape({
        timeout: getDurationValidationSchema({ minimum: '10s' }).required(getString?.('validation.timeout10SecMinimum'))
      })

      try {
        timeout.validateSync(data)
      } catch (e) {
        /* istanbul ignore else */
        if (e instanceof Yup.ValidationError) {
          const err = yupToFormErrors(e)

          Object.assign(errors, err)
        }
      }
    }

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
  protected isHarnessSpecific = true
  protected invocationMap: Map<
    RegExp,
    (path: string, yaml: string, params: Record<string, unknown>) => Promise<CompletionItemInterface[]>
  > = new Map()

  protected defaultValues: ShellScriptData = {
    identifier: '',
    timeout: '10m',
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

  constructor() {
    super()
    this.invocationMap.set(ConnectorRefRegex, this.getSecretsListForYaml.bind(this))
  }

  protected async getSecretsListForYaml(
    path: string,
    yaml: string,
    params: Record<string, unknown>
  ): Promise<CompletionItemInterface[]> {
    let pipelineObj
    try {
      pipelineObj = parse(yaml)
    } catch (err) {
      logger.error('Error while parsing the yaml', err)
    }
    const { accountId } = params as {
      accountId: string
      orgIdentifier: string
      projectIdentifier: string
    }
    if (pipelineObj) {
      const obj = get(pipelineObj, path.replace('.spec.connectorRef', ''))
      if (obj) {
        const listOfSecrets = await listSecretsV2Promise({
          queryParams: {
            accountIdentifier: accountId,
            includeSecretsFromEverySubScope: true,
            types: ['SecretText', 'SSHKey'],
            pageIndex: 0,
            pageSize: 10
          }
        }).then(response =>
          response?.data?.content?.map(connector => {
            return {
              label: getConnectorName(connector),
              insertText: getConnectorValue(connector),
              kind: CompletionItemKind.Field
            }
          })
        )
        return listOfSecrets || []
      }
    }

    return new Promise(resolve => {
      resolve([])
    })
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
