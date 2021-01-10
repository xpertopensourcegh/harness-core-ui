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
import { StepViewType } from '@pipeline/exports'
import type { K8sRollingRollbackStepInfo, StepElement } from 'services/cd-ng'
import { ConfigureOptions } from '@common/components/ConfigureOptions/ConfigureOptions'
import { useStrings, UseStringsReturn } from 'framework/exports'
import { FormMultiTypeDurationField } from '@common/components/MultiTypeDuration/MultiTypeDuration'
import { StepType } from '../../PipelineStepInterface'
import { PipelineStep, StepProps } from '../../PipelineStep'

export interface BarrierData extends StepElement {
  spec: K8sRollingRollbackStepInfo
}

interface BarrierProps {
  initialValues: BarrierData
  onUpdate?: (data: BarrierData) => void
  stepViewType?: StepViewType
  inputSetData?: {
    template?: BarrierData
    path?: string
  }
}

const BarrierWidget: React.FC<BarrierProps> = ({ initialValues, onUpdate }): JSX.Element => {
  const { getString } = useStrings()
  return (
    <>
      <Formik<BarrierData>
        onSubmit={(values: BarrierData) => {
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
                  summary={getString('pipelineSteps.barrier')}
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

const BarrierInputStep: React.FC<BarrierProps> = ({ inputSetData }) => {
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

export class BarrierStep extends PipelineStep<BarrierData> {
  renderStep(props: StepProps<BarrierData>): JSX.Element {
    const { initialValues, onUpdate, stepViewType, inputSetData } = props

    if (stepViewType === StepViewType.InputSet || stepViewType === StepViewType.DeploymentForm) {
      return (
        <BarrierInputStep
          initialValues={initialValues}
          onUpdate={onUpdate}
          stepViewType={stepViewType}
          inputSetData={inputSetData}
        />
      )
    }
    return <BarrierWidget initialValues={initialValues} onUpdate={onUpdate} stepViewType={stepViewType} />
  }
  validateInputSet(data: BarrierData, template: BarrierData, getString?: UseStringsReturn['getString']): object {
    const errors = {} as any
    if (isEmpty(data?.spec?.timeout) && getMultiTypeFromValue(template?.spec?.timeout) === MultiTypeInputType.RUNTIME) {
      errors.spec = {}
      errors.spec.timeout = getString?.('fieldRequired', { field: 'Timeout' })
    }
    return errors
  }

  protected type = StepType.Barrier
  protected stepName = 'Barrier'
  protected stepIcon: IconName = 'command-barrier'

  protected defaultValues: BarrierData = {
    identifier: '',
    spec: {
      timeout: '10m'
    }
  }
}
