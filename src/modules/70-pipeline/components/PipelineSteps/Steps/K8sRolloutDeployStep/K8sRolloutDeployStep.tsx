import React from 'react'
import {
  IconName,
  Formik,
  FormInput,
  Button,
  getMultiTypeFromValue,
  MultiTypeInputType,
  Layout
} from '@wings-software/uicore'
import * as Yup from 'yup'

import { FormikProps, yupToFormErrors } from 'formik'
import { isEmpty } from 'lodash-es'
import { StepViewType, StepProps } from '@pipeline/exports'
import type { K8sRollingStepInfo, StepElementConfig } from 'services/cd-ng'
import { FormMultiTypeCheckboxField } from '@common/components'
import { ConfigureOptions } from '@common/components/ConfigureOptions/ConfigureOptions'
import { setFormikRef } from '@pipeline/components/AbstractSteps/Step'
import type { StepFormikFowardRef } from '@pipeline/components/AbstractSteps/Step'
import { useStrings, UseStringsReturn } from 'framework/exports'
import {
  DurationInputFieldForInputSet,
  FormMultiTypeDurationField,
  getDurationValidationSchema
} from '@common/components/MultiTypeDuration/MultiTypeDuration'
import type { VariableMergeServiceResponse } from 'services/pipeline-ng'
import { VariablesListTable } from '@pipeline/components/VariablesListTable/VariablesListTable'
import { StepType } from '../../PipelineStepInterface'
import { PipelineStep } from '../../PipelineStep'
import stepCss from '../Steps.module.scss'

export interface K8RolloutDeployData extends StepElementConfig {
  spec: K8sRollingStepInfo
}

interface K8RolloutDeployProps {
  initialValues: K8RolloutDeployData
  onUpdate?: (data: K8RolloutDeployData) => void
  stepViewType?: StepViewType
  inputSetData?: {
    template?: K8RolloutDeployData
    path?: string
    readonly?: boolean
  }
}

function K8RolloutDeployWidget(
  props: K8RolloutDeployProps,
  formikRef: StepFormikFowardRef<K8RolloutDeployData>
): React.ReactElement {
  const { initialValues, onUpdate } = props
  const { getString } = useStrings()
  return (
    <>
      <Formik<K8RolloutDeployData>
        onSubmit={(values: K8RolloutDeployData) => {
          onUpdate?.(values)
        }}
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          name: Yup.string().required(getString('pipelineSteps.stepNameRequired')),
          timeout: getDurationValidationSchema({ minimum: '10s' }).required(getString('validation.timeout10SecMinimum'))
        })}
      >
        {(formik: FormikProps<K8RolloutDeployData>) => {
          setFormikRef(formikRef, formik)
          const { values, submitForm, setFieldValue } = formik
          return (
            <>
              <Layout.Vertical padding={{ left: 'xsmall', right: 'xsmall' }}>
                <div className={stepCss.formGroup}>
                  <FormInput.InputWithIdentifier inputLabel={getString('name')} />
                </div>
                <div className={stepCss.formGroup}>
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
                </div>
                <div className={stepCss.formGroup}>
                  <FormMultiTypeCheckboxField name="spec.skipDryRun" label={getString('pipelineSteps.skipDryRun')} />
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

const K8RolloutDeployInputStep: React.FC<K8RolloutDeployProps> = ({ inputSetData }) => {
  const { getString } = useStrings()
  return (
    <>
      {getMultiTypeFromValue(inputSetData?.template?.timeout) === MultiTypeInputType.RUNTIME && (
        <DurationInputFieldForInputSet
          label={getString('pipelineSteps.timeoutLabel')}
          name={`${isEmpty(inputSetData?.path) ? '' : `${inputSetData?.path}.`}timeout`}
          disabled={inputSetData?.readonly}
        />
      )}
      {getMultiTypeFromValue(inputSetData?.template?.spec?.skipDryRun) === MultiTypeInputType.RUNTIME && (
        <FormInput.CheckBox
          name={`${isEmpty(inputSetData?.path) ? '' : `${inputSetData?.path}.`}spec.skipDryRun`}
          className={stepCss.checkbox}
          label={getString('pipelineSteps.skipDryRun')}
          disabled={inputSetData?.readonly}
        />
      )}
    </>
  )
}
export interface K8RolloutDeployVariableStepProps {
  initialValues: K8RolloutDeployData
  stageIdentifier: string
  onUpdate?(data: K8RolloutDeployData): void
  metadataMap: Required<VariableMergeServiceResponse>['metadataMap']
  variablesData: K8RolloutDeployData
}

const K8RolloutDeployVariableStep: React.FC<K8RolloutDeployVariableStepProps> = ({
  variablesData,
  metadataMap,
  initialValues
}) => {
  return <VariablesListTable data={variablesData.spec} originalData={initialValues.spec} metadataMap={metadataMap} />
}

const K8sRolloutDeployRef = React.forwardRef(K8RolloutDeployWidget)
export class K8RolloutDeployStep extends PipelineStep<K8RolloutDeployData> {
  constructor() {
    super()
    this._hasStepVariables = true
  }
  renderStep(props: StepProps<K8RolloutDeployData>): JSX.Element {
    const { initialValues, onUpdate, stepViewType, inputSetData, formikRef, customStepProps } = props

    if (stepViewType === StepViewType.InputSet || stepViewType === StepViewType.DeploymentForm) {
      return (
        <K8RolloutDeployInputStep
          initialValues={initialValues}
          onUpdate={onUpdate}
          stepViewType={stepViewType}
          inputSetData={inputSetData}
        />
      )
    } else if (stepViewType === StepViewType.InputVariable) {
      return (
        <K8RolloutDeployVariableStep
          {...(customStepProps as K8RolloutDeployVariableStepProps)}
          initialValues={initialValues}
          onUpdate={onUpdate}
        />
      )
    }

    return (
      <K8sRolloutDeployRef
        initialValues={initialValues}
        onUpdate={onUpdate}
        stepViewType={stepViewType}
        ref={formikRef}
      />
    )
  }
  validateInputSet(
    data: K8RolloutDeployData,
    template: K8RolloutDeployData,
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

  protected type = StepType.K8sRollingDeploy
  protected stepName = 'K8s Rollout Deploy'
  protected stepIcon: IconName = 'rolling'

  protected defaultValues: K8RolloutDeployData = {
    identifier: '',
    timeout: '10m',
    spec: {
      skipDryRun: false
    }
  }
}
