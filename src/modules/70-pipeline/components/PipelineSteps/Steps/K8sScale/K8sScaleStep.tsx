import React from 'react'
import { IconName, Formik, FormInput, Button, getMultiTypeFromValue, MultiTypeInputType } from '@wings-software/uicore'
import * as Yup from 'yup'
import { FormikProps, yupToFormErrors } from 'formik'
import { isEmpty } from 'lodash-es'
import { StepViewType, StepProps } from '@pipeline/exports'
import type { StepFormikFowardRef } from '@pipeline/components/AbstractSteps/Step'
import { setFormikRef } from '@pipeline/components/AbstractSteps/Step'
import type {
  CountInstanceSelection,
  K8sScaleStepInfo,
  PercentageInstanceSelection,
  StepElementConfig
} from 'services/cd-ng'
import { FormMultiTypeCheckboxField, FormInstanceDropdown } from '@common/components'
import { InstanceTypes } from '@common/constants/InstanceTypes'
import {
  DurationInputFieldForInputSet,
  FormMultiTypeDurationField,
  getDurationValidationSchema
} from '@common/components/MultiTypeDuration/MultiTypeDuration'
import { ConfigureOptions } from '@common/components/ConfigureOptions/ConfigureOptions'

import { useStrings, UseStringsReturn } from 'framework/exports'
import { getInstanceDropdownSchema } from '@common/components/InstanceDropdownField/InstanceDropdownField'
import { StepType } from '../../PipelineStepInterface'
import { PipelineStep } from '../../PipelineStep'
import stepCss from '../Steps.module.scss'

export interface K8sScaleData extends StepElementConfig {
  spec: K8sScaleStepInfo
  identifier: string
}

interface K8sScaleProps {
  initialValues: K8sScaleData
  onUpdate?: (data: K8sScaleData) => void
  stepViewType?: StepViewType
  template?: K8sScaleData
  readonly?: boolean
  path?: string
}

function K8ScaleDeployWidget(props: K8sScaleProps, formikRef: StepFormikFowardRef<K8sScaleData>): React.ReactElement {
  const { initialValues, onUpdate } = props
  const { getString } = useStrings()

  return (
    <>
      <Formik<K8sScaleData>
        onSubmit={(values: K8sScaleData) => {
          onUpdate?.(values)
        }}
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          name: Yup.string().required(getString('pipelineSteps.stepNameRequired')),
          timeout: getDurationValidationSchema({ minimum: '10s' }).required(
            getString('validation.timeout10SecMinimum')
          ),
          spec: Yup.object().shape({
            instanceSelection: getInstanceDropdownSchema()
          })
        })}
      >
        {(formik: FormikProps<K8sScaleData>) => {
          const { submitForm, values, setFieldValue } = formik
          setFormikRef(formikRef, formik)
          return (
            <>
              <>
                <div className={stepCss.formGroup}>
                  <FormInput.InputWithIdentifier inputLabel={getString('name')} />
                </div>
                <div className={stepCss.formGroup}>
                  <FormInstanceDropdown
                    name={'spec.instanceSelection'}
                    label={getString('pipelineSteps.instanceLabel')}
                  />
                  {(getMultiTypeFromValue(
                    (values?.spec?.instanceSelection?.spec as CountInstanceSelection | undefined)?.count
                  ) === MultiTypeInputType.RUNTIME ||
                    getMultiTypeFromValue(
                      (values?.spec?.instanceSelection?.spec as PercentageInstanceSelection | undefined)?.percentage
                    ) === MultiTypeInputType.RUNTIME) && (
                    <ConfigureOptions
                      value={
                        ((values?.spec?.instanceSelection?.spec as CountInstanceSelection | undefined)
                          ?.count as string) ||
                        ((values?.spec?.instanceSelection?.spec as PercentageInstanceSelection | undefined)
                          ?.percentage as string)
                      }
                      type="String"
                      variableName={getString('instanceFieldOptions.instances')}
                      showRequiredField={false}
                      showDefaultField={false}
                      showAdvanced={true}
                      onChange={value => {
                        setFieldValue('instances', value)
                      }}
                    />
                  )}
                </div>

                <div className={stepCss.formGroup}>
                  <FormInput.MultiTextInput label={getString('pipelineSteps.workload')} name={'spec.workload'} />
                  {getMultiTypeFromValue(values.spec.workload) === MultiTypeInputType.RUNTIME && (
                    <ConfigureOptions
                      value={values.spec.workload as string}
                      type="String"
                      variableName={getString('pipelineSteps.workload')}
                      showRequiredField={false}
                      showDefaultField={false}
                      showAdvanced={true}
                      onChange={value => {
                        setFieldValue('spec.workload', value)
                      }}
                    />
                  )}
                </div>

                <div className={stepCss.formGroup}>
                  <FormMultiTypeDurationField
                    name="timeout"
                    label={getString('pipelineSteps.timeoutLabel')}
                    className={stepCss.duration}
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
              </>
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

const K8ScaleInputStep: React.FC<K8sScaleProps> = ({ template, readonly, path }) => {
  const { getString } = useStrings()
  const prefix = isEmpty(path) ? '' : `${path}.`
  return (
    <>
      {getMultiTypeFromValue(template?.spec?.workload) === MultiTypeInputType.RUNTIME && (
        <FormInput.Text name="spec.workload" label={getString('pipelineSteps.workload')} disabled={readonly} />
      )}
      {getMultiTypeFromValue(template?.timeout) === MultiTypeInputType.RUNTIME ? (
        <DurationInputFieldForInputSet
          label={getString('pipelineSteps.timeoutLabel')}
          name={`${prefix}timeout`}
          disabled={readonly}
        />
      ) : null}
      {getMultiTypeFromValue(template?.spec?.skipDryRun) === MultiTypeInputType.RUNTIME && (
        <FormInput.CheckBox
          name={`${prefix}spec.skipDryRun`}
          className={stepCss.checkbox}
          label={getString('pipelineSteps.skipDryRun')}
          disabled={readonly}
        />
      )}
      {(getMultiTypeFromValue(
        (template?.spec?.instanceSelection?.spec as CountInstanceSelection | undefined)?.count
      ) === MultiTypeInputType.RUNTIME ||
        getMultiTypeFromValue(
          (template?.spec?.instanceSelection?.spec as PercentageInstanceSelection | undefined)?.percentage
        ) === MultiTypeInputType.RUNTIME) && (
        <FormInstanceDropdown
          label={getString('pipelineSteps.instanceLabel')}
          name={`${prefix}spec.instanceSelection`}
          disabledType
          disabled={readonly}
        />
      )}
    </>
  )
}
const K8ScaleDeployWidgetWithRef = React.forwardRef(K8ScaleDeployWidget)
export class K8sScaleStep extends PipelineStep<K8sScaleData> {
  renderStep(props: StepProps<K8sScaleData>): JSX.Element {
    const { initialValues, onUpdate, stepViewType, inputSetData, formikRef } = props

    if (stepViewType === StepViewType.InputSet || stepViewType === StepViewType.DeploymentForm) {
      return (
        <K8ScaleInputStep
          initialValues={initialValues}
          onUpdate={onUpdate}
          stepViewType={stepViewType}
          template={inputSetData?.template}
          readonly={inputSetData?.readonly}
          path={inputSetData?.path}
        />
      )
    }
    return (
      <K8ScaleDeployWidgetWithRef
        initialValues={initialValues}
        onUpdate={onUpdate}
        stepViewType={stepViewType}
        ref={formikRef}
      />
    )
  }

  protected type = StepType.K8sScale
  protected stepName = 'K8s Scale'

  protected stepIcon: IconName = 'service-kubernetes'
  /* istanbul ignore next */
  validateInputSet(data: K8sScaleData, template: K8sScaleData, getString?: UseStringsReturn['getString']): object {
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
    } else if (
      getMultiTypeFromValue((template?.spec?.instanceSelection?.spec as CountInstanceSelection | undefined)?.count) ===
        MultiTypeInputType.RUNTIME ||
      getMultiTypeFromValue(
        (template?.spec?.instanceSelection?.spec as PercentageInstanceSelection | undefined)?.percentage
      ) === MultiTypeInputType.RUNTIME
    ) {
      const instanceSelection = Yup.object().shape({
        instanceSelection: getInstanceDropdownSchema({
          required: true,
          requiredErrorMessage: getString?.('fieldRequired', { field: 'Instance' })
        })
      })

      try {
        instanceSelection.validateSync(data.spec)
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
  protected defaultValues: K8sScaleData = {
    identifier: '',
    timeout: '10m',
    spec: {
      skipDryRun: false,
      workload: '',
      instanceSelection: { type: InstanceTypes.Instances, spec: { count: 0 } as any }
    }
  }
}
