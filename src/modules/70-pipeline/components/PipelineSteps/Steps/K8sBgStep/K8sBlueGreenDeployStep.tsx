import React from 'react'
import {
  IconName,
  Formik,
  FormInput,
  Button,
  Layout,
  getMultiTypeFromValue,
  MultiTypeInputType,
  Accordion
} from '@wings-software/uicore'
import * as Yup from 'yup'
import { FormikProps, yupToFormErrors } from 'formik'
import { isEmpty } from 'lodash-es'
import { StepViewType, StepProps } from '@pipeline/exports'
import type { StepFormikFowardRef } from '@pipeline/components/AbstractSteps/Step'
import { setFormikRef } from '@pipeline/components/AbstractSteps/Step'
import { useStrings, UseStringsReturn } from 'framework/exports'
import type { K8sRollingStepInfo, StepElement } from 'services/cd-ng'
import { FormMultiTypeCheckboxField } from '@common/components'
import { ConfigureOptions } from '@common/components/ConfigureOptions/ConfigureOptions'
import {
  DurationInputFieldForInputSet,
  FormMultiTypeDurationField,
  getDurationValidationSchema
} from '@common/components/MultiTypeDuration/MultiTypeDuration'
import { StepType } from '../../PipelineStepInterface'
import { PipelineStep } from '../../PipelineStep'
import stepCss from '../Steps.module.scss'

export interface K8sBGDeployData extends StepElement {
  spec: K8sRollingStepInfo
}

interface K8BGDeployProps {
  initialValues: K8sBGDeployData
  onUpdate?: (data: K8sBGDeployData) => void
  stepViewType?: StepViewType
  inputSetData?: {
    template?: K8sBGDeployData
    path?: string
    readonly?: boolean
  }
}

function K8BGDeployWidget(props: K8BGDeployProps, formikRef: StepFormikFowardRef<K8sBGDeployData>): React.ReactElement {
  const { initialValues, onUpdate } = props
  const { getString } = useStrings()

  return (
    <>
      <Formik<K8sBGDeployData>
        onSubmit={(values: K8sBGDeployData) => {
          onUpdate?.(values)
        }}
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          name: Yup.string().required(getString('pipelineSteps.stepNameRequired')),

          spec: Yup.object().shape({
            timeout: getDurationValidationSchema({ minimum: '10s' }).required(
              getString('validation.timeout10SecMinimum')
            )
          })
        })}
      >
        {(formik: FormikProps<K8sBGDeployData>) => {
          const { submitForm, values, setFieldValue } = formik
          setFormikRef(formikRef, formik)
          return (
            <>
              <Accordion activeId="details" collapseProps={{ transitionDuration: 0 }}>
                <Accordion.Panel
                  id="details"
                  summary={getString('pipelineSteps.k8sBGDeploy')}
                  details={
                    <>
                      <div className={stepCss.formGroup}>
                        <FormInput.InputWithIdentifier inputLabel={getString('name')} />
                      </div>
                      <div className={stepCss.formGroup}>
                        <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                          <FormMultiTypeDurationField
                            name="spec.timeout"
                            label={getString('pipelineSteps.timeoutLabel')}
                            multiTypeDurationProps={{ enableConfigureOptions: false }}
                          />
                          {getMultiTypeFromValue(values.spec.timeout) === MultiTypeInputType.RUNTIME && (
                            <ConfigureOptions
                              value={values.spec.timeout as string}
                              type="String"
                              variableName="step.spec.timeout"
                              showRequiredField={false}
                              showDefaultField={false}
                              showAdvanced={true}
                              onChange={value => {
                                setFieldValue('spec.timeout', value)
                              }}
                            />
                          )}
                        </Layout.Horizontal>
                      </div>
                      <div className={stepCss.formGroup}>
                        <FormMultiTypeCheckboxField
                          name="spec.skipDryRun"
                          label={getString('pipelineSteps.skipDryRun')}
                        />
                      </div>
                    </>
                  }
                />
              </Accordion>
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

const K8BGDeployInputStep: React.FC<K8BGDeployProps> = ({ inputSetData }) => {
  const { getString } = useStrings()
  return (
    <>
      {getMultiTypeFromValue(inputSetData?.template?.spec?.timeout) === MultiTypeInputType.RUNTIME && (
        <DurationInputFieldForInputSet
          label={getString('pipelineSteps.timeoutLabel')}
          name={`${isEmpty(inputSetData?.path) ? '' : `${inputSetData?.path}.`}spec.timeout`}
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
const K8BGDeployWidgetWidgetWithRef = React.forwardRef(K8BGDeployWidget)
export class K8sBlueGreenDeployStep extends PipelineStep<K8sBGDeployData> {
  renderStep(props: StepProps<K8sBGDeployData>): JSX.Element {
    const { initialValues, onUpdate, stepViewType, inputSetData, formikRef } = props

    if (stepViewType === StepViewType.InputSet || stepViewType === StepViewType.DeploymentForm) {
      return (
        <K8BGDeployInputStep
          initialValues={initialValues}
          onUpdate={onUpdate}
          stepViewType={stepViewType}
          inputSetData={inputSetData}
        />
      )
    }
    return (
      <K8BGDeployWidgetWidgetWithRef
        initialValues={initialValues}
        onUpdate={onUpdate}
        stepViewType={stepViewType}
        ref={formikRef}
      />
    )
  }

  validateInputSet(
    data: K8sBGDeployData,
    template: K8sBGDeployData,
    getString?: UseStringsReturn['getString']
  ): object {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errors = { spec: {} } as any
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
  protected type = StepType.K8sBlueGreenDeploy
  protected stepName = 'K8s Blue Green Deploy'
  protected stepIcon: IconName = 'service-kubernetes'

  protected defaultValues: K8sBGDeployData = {
    identifier: '',
    spec: {
      skipDryRun: false,
      timeout: '10m'
    }
  }
}
