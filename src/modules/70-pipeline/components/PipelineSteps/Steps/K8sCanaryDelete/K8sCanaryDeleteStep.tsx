import React from 'react'
import {
  IconName,
  Formik,
  FormInput,
  Button,
  Layout,
  getMultiTypeFromValue,
  MultiTypeInputType,
  TextInput,
  Accordion
} from '@wings-software/uicore'
import * as Yup from 'yup'
import { FormGroup } from '@blueprintjs/core'
import { StepViewType, StepProps } from '@pipeline/exports'
import type { StepElement } from 'services/cd-ng'
import { FormMultiTypeDurationField } from '@common/components/MultiTypeDuration/MultiTypeDuration'
import { ConfigureOptions } from '@common/components/ConfigureOptions/ConfigureOptions'

import { useStrings } from 'framework/exports'
import { StepType } from '../../PipelineStepInterface'
import { PipelineStep } from '../../PipelineStep'
import stepCss from '../Steps.module.scss'

interface K8sCanaryDeployProps {
  initialValues: StepElement
  onUpdate?: (data: StepElement) => void
  stepViewType?: StepViewType
  template?: StepElement
  readonly?: boolean
}

const K8sCanaryDeleteWidget: React.FC<K8sCanaryDeployProps> = ({ initialValues, onUpdate }): JSX.Element => {
  const { getString } = useStrings()

  return (
    <>
      <Formik<StepElement>
        onSubmit={(values: StepElement) => {
          onUpdate?.(values)
        }}
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          name: Yup.string().required(getString('pipelineSteps.stepNameRequired'))
        })}
      >
        {({ submitForm, values, setFieldValue }) => {
          return (
            <Layout.Vertical spacing="xlarge">
              <Accordion activeId="details" collapseProps={{ transitionDuration: 0 }}>
                <Accordion.Panel
                  id="details"
                  summary={getString('pipelineSteps.K8sCanaryDelete')}
                  details={
                    <>
                      <div className={stepCss.formGroup}>
                        <FormInput.InputWithIdentifier inputLabel={getString('name')} />
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
                            variableName="timeout"
                            showRequiredField={false}
                            showDefaultField={false}
                            showAdvanced={true}
                            onChange={value => {
                              setFieldValue('timeout', value)
                            }}
                          />
                        )}
                      </div>
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

const K8sCanaryDeleteInputWidget: React.FC<K8sCanaryDeployProps> = ({ onUpdate, initialValues, template }) => {
  const { getString } = useStrings()
  return (
    <>
      {getMultiTypeFromValue(template?.timeout) === MultiTypeInputType.RUNTIME && (
        <FormGroup label={getString('pipelineSteps.timeoutLabel')}>
          <TextInput
            name="timeout"
            onChange={(event: React.SyntheticEvent<HTMLInputElement>) => {
              onUpdate?.({ ...initialValues, spec: { ...initialValues.spec, timeout: event.currentTarget.value } })
            }}
          />
        </FormGroup>
      )}
    </>
  )
}

export class K8sCanaryDeleteStep extends PipelineStep<StepElement> {
  renderStep(props: StepProps<StepElement>): JSX.Element {
    const { initialValues, onUpdate, stepViewType, inputSetData } = props

    if (stepViewType === StepViewType.InputSet || stepViewType === StepViewType.DeploymentForm) {
      return (
        <K8sCanaryDeleteInputWidget
          initialValues={initialValues}
          onUpdate={onUpdate}
          stepViewType={stepViewType}
          template={inputSetData?.template}
          readonly={!!inputSetData?.readonly}
        />
      )
    }
    return (
      <K8sCanaryDeleteWidget
        initialValues={initialValues}
        onUpdate={onUpdate}
        stepViewType={stepViewType}
        readonly={!!inputSetData?.readonly}
      />
    )
  }

  protected type = StepType.K8sCanaryDelete
  protected stepName = 'K8s Canary Delete'

  protected stepIcon: IconName = 'service-kubernetes'
  /* istanbul ignore next */
  validateInputSet(): object {
    /* istanbul ignore next */
    return {}
  }
  protected defaultValues: StepElement = {
    name: '',
    identifier: '',
    timeout: '10m'
  }
}
