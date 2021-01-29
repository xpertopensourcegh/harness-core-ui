import React from 'react'
import {
  IconName,
  Formik,
  FormInput,
  Button,
  Layout,
  getMultiTypeFromValue,
  MultiTypeInputType
} from '@wings-software/uicore'
import * as Yup from 'yup'
import { FormikProps, yupToFormErrors } from 'formik'
import { isEmpty } from 'lodash-es'
import { StepViewType, StepProps } from '@pipeline/exports'
import type { StepFormikFowardRef } from '@pipeline/components/AbstractSteps/Step'
import { setFormikRef } from '@pipeline/components/AbstractSteps/Step'
import type { StepElementConfig } from 'services/cd-ng'
import type { VariableMergeServiceResponse } from 'services/pipeline-ng'
import { VariablesListTable } from '@pipeline/components/VariablesListTable/VariablesListTable'
import { ConfigureOptions } from '@common/components/ConfigureOptions/ConfigureOptions'
import { useStrings, UseStringsReturn } from 'framework/exports'
import {
  DurationInputFieldForInputSet,
  FormMultiTypeDurationField,
  getDurationValidationSchema
} from '@common/components/MultiTypeDuration/MultiTypeDuration'

import { StepType } from '../../PipelineStepInterface'
import { PipelineStep } from '../../PipelineStep'
import stepCss from '../Steps.module.scss'

type K8sRollingRollbackData = StepElementConfig

export interface K8RollingRollbackVariableStepProps {
  initialValues: K8sRollingRollbackData
  stageIdentifier: string
  onUpdate?(data: K8sRollingRollbackData): void
  metadataMap: Required<VariableMergeServiceResponse>['metadataMap']
  variablesData: K8sRollingRollbackData
}

interface K8sRollingRollbackProps {
  initialValues: K8sRollingRollbackData
  onUpdate?: (data: K8sRollingRollbackData) => void
  stepViewType?: StepViewType
  inputSetData?: {
    template?: K8sRollingRollbackData
    path?: string
    readonly?: boolean
  }
}

function K8sRollingRollbackWidget(
  props: K8sRollingRollbackProps,
  formikRef: StepFormikFowardRef<K8sRollingRollbackData>
): React.ReactElement {
  const { initialValues, onUpdate } = props
  const { getString } = useStrings()
  return (
    <>
      <Formik<K8sRollingRollbackData>
        onSubmit={(values: K8sRollingRollbackData) => {
          onUpdate?.(values)
        }}
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          name: Yup.string().required(getString('pipelineSteps.stepNameRequired')),
          timeout: getDurationValidationSchema({ minimum: '10s' }).required(getString('validation.timeout10SecMinimum'))
        })}
      >
        {(formik: FormikProps<K8sRollingRollbackData>) => {
          const { values, setFieldValue, submitForm } = formik
          setFormikRef(formikRef, formik)

          return (
            <>
              <Layout.Vertical padding={{ left: 'xsmall', right: 'xsmall' }}>
                <div className={stepCss.formGroup}>
                  <FormInput.InputWithIdentifier inputLabel={getString('name')} />
                </div>
                <div className={stepCss.formGroup}>
                  <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                    <FormMultiTypeDurationField
                      name="timeout"
                      label={getString('pipelineSteps.timeoutLabel')}
                      multiTypeDurationProps={{ enableConfigureOptions: false }}
                    />
                    {getMultiTypeFromValue(values.timeout) === MultiTypeInputType.RUNTIME && (
                      <ConfigureOptions
                        value={values.timeout as string}
                        type="String"
                        variableName="step.timeout"
                        showRequiredField={false}
                        showDefaultField={false}
                        showAdvanced={true}
                        onChange={value => {
                          setFieldValue('timeout', value)
                        }}
                      />
                    )}
                  </Layout.Horizontal>
                </div>
              </Layout.Vertical>
              <div className={stepCss.actionsPanel}>
                <Button intent="primary" text={getString('submit')} onClick={submitForm} />
              </div>
            </>
          )
        }}
      </Formik>
    </>
  )
}

const K8sRollingRollbackInputStep: React.FC<K8sRollingRollbackProps> = ({ inputSetData }) => {
  const { getString } = useStrings()
  return (
    <>
      {getMultiTypeFromValue(inputSetData?.template?.timeout) === MultiTypeInputType.RUNTIME && (
        <DurationInputFieldForInputSet
          name={`${isEmpty(inputSetData?.path) ? '' : `${inputSetData?.path}.`}timeout`}
          label={getString('pipelineSteps.timeoutLabel')}
          disabled={inputSetData?.readonly}
        />
      )}
    </>
  )
}

const K8RollingRollbackVariableStep: React.FC<K8RollingRollbackVariableStepProps> = ({
  variablesData,
  metadataMap,
  initialValues
}) => {
  return <VariablesListTable data={variablesData.spec} originalData={initialValues.spec} metadataMap={metadataMap} />
}

const K8sRollingRollbackWidgetWithRef = React.forwardRef(K8sRollingRollbackWidget)
export class K8sRollingRollbackStep extends PipelineStep<K8sRollingRollbackData> {
  constructor() {
    super()
    this._hasStepVariables = true
  }
  renderStep(props: StepProps<K8sRollingRollbackData>): JSX.Element {
    const { initialValues, onUpdate, stepViewType, inputSetData, formikRef, customStepProps } = props
    if (stepViewType === StepViewType.InputSet || stepViewType === StepViewType.DeploymentForm) {
      return (
        <K8sRollingRollbackInputStep
          initialValues={initialValues}
          onUpdate={onUpdate}
          stepViewType={stepViewType}
          inputSetData={inputSetData}
        />
      )
    } else if (stepViewType === StepViewType.InputVariable) {
      return (
        <K8RollingRollbackVariableStep
          {...(customStepProps as K8RollingRollbackVariableStepProps)}
          initialValues={initialValues}
          onUpdate={onUpdate}
        />
      )
    }
    return (
      <K8sRollingRollbackWidgetWithRef
        initialValues={initialValues}
        onUpdate={onUpdate}
        stepViewType={stepViewType}
        ref={formikRef}
      />
    )
  }
  validateInputSet(
    data: K8sRollingRollbackData,
    template: K8sRollingRollbackData,
    getString?: UseStringsReturn['getString']
  ): object {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errors = { spec: {} } as any
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
    if (isEmpty(errors.spec)) {
      delete errors.spec
    }
    return errors
  }

  protected type = StepType.K8sRollingRollback
  protected stepName = 'K8s Rollout Rollback'
  protected stepIcon: IconName = 'undo'

  protected defaultValues: K8sRollingRollbackData = {
    identifier: '',
    timeout: '10m'
  }
}
