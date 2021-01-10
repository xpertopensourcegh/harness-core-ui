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
import { isEmpty } from 'lodash-es'
import { StepViewType, StepProps } from '@pipeline/exports'
import type { K8sRollingRollbackStepInfo, StepElement } from 'services/cd-ng'
import { ConfigureOptions } from '@common/components/ConfigureOptions/ConfigureOptions'
import { useStrings, UseStringsReturn } from 'framework/exports'
import { FormMultiTypeDurationField } from '@common/components/MultiTypeDuration/MultiTypeDuration'
import { StepType } from '../../PipelineStepInterface'
import { PipelineStep } from '../../PipelineStep'

export interface K8sRollingRollbackData extends StepElement {
  spec: K8sRollingRollbackStepInfo
}

interface K8sRollingRollbackProps {
  initialValues: K8sRollingRollbackData
  onUpdate?: (data: K8sRollingRollbackData) => void
  stepViewType?: StepViewType
  inputSetData?: {
    template?: K8sRollingRollbackData
    path?: string
  }
}

const K8sRollingRollbackWidget: React.FC<K8sRollingRollbackProps> = ({ initialValues, onUpdate }): JSX.Element => {
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
          spec: Yup.string().required(getString('pipelineSteps.timeoutRequired'))
        })}
      >
        {({ submitForm, values, setFieldValue }) => {
          return (
            <Layout.Vertical spacing="xlarge">
              <Accordion activeId="details" collapseProps={{ transitionDuration: 0 }}>
                <Accordion.Panel
                  id="details"
                  summary={getString('pipelineSteps.k8sRolloutRollback')}
                  details={
                    <>
                      <FormInput.InputWithIdentifier inputLabel={getString('name')} />
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
                    </>
                  }
                />
              </Accordion>
              <Button intent="primary" text={getString('submit')} onClick={submitForm} />
            </Layout.Vertical>
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
      {getMultiTypeFromValue(inputSetData?.template?.spec?.timeout) === MultiTypeInputType.RUNTIME && (
        <FormMultiTypeDurationField
          name={`${isEmpty(inputSetData?.path) ? '' : `${inputSetData?.path}.`}spec.timeout`}
          label={getString('pipelineSteps.timeoutLabel')}
          multiTypeDurationProps={{ enableConfigureOptions: false }}
        />
      )}
    </>
  )
}

export class K8sRollingRollbackStep extends PipelineStep<K8sRollingRollbackData> {
  renderStep(props: StepProps<K8sRollingRollbackData>): JSX.Element {
    const { initialValues, onUpdate, stepViewType, inputSetData } = props
    if (stepViewType === StepViewType.InputSet || stepViewType === StepViewType.DeploymentForm) {
      return (
        <K8sRollingRollbackInputStep
          initialValues={initialValues}
          onUpdate={onUpdate}
          stepViewType={stepViewType}
          inputSetData={inputSetData}
        />
      )
    }
    return <K8sRollingRollbackWidget initialValues={initialValues} onUpdate={onUpdate} stepViewType={stepViewType} />
  }
  validateInputSet(
    data: K8sRollingRollbackData,
    template: K8sRollingRollbackData,
    getString?: UseStringsReturn['getString']
  ): object {
    const errors = {} as any
    if (isEmpty(data?.spec?.timeout) && getMultiTypeFromValue(template?.spec?.timeout) === MultiTypeInputType.RUNTIME) {
      errors.spec = {}
      errors.spec.timeout = getString?.('fieldRequired', { field: 'Timeout' })
    }
    return errors
  }

  protected type = StepType.K8sRollingRollback
  protected stepName = 'K8s Rollout Rollback'
  protected stepIcon: IconName = 'service-kubernetes'

  protected defaultValues: K8sRollingRollbackData = {
    identifier: '',
    spec: {
      timeout: '10m'
    }
  }
}
