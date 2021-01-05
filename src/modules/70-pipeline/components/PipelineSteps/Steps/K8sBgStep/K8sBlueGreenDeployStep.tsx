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
  Checkbox
} from '@wings-software/uicore'
import * as Yup from 'yup'
// import { get } from 'lodash-es'
import { FormGroup } from '@blueprintjs/core'
import { StepViewType } from '@pipeline/exports'
import type { K8sRollingStepInfo, StepElement } from 'services/cd-ng'
import Accordion from '@common/components/Accordion/Accordion'
import { FormMultiTypeCheckboxField } from '@common/components'
import { ConfigureOptions } from '@common/components/ConfigureOptions/ConfigureOptions'
import { useStrings } from 'framework/exports'
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
  template?: K8sBGDeployData
}

const K8BGDeployWidget: React.FC<K8BGDeployProps> = ({ initialValues, onUpdate }): JSX.Element => {
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

          spec: Yup.string().required(getString('pipelineSteps.timeoutRequired'))
        })}
      >
        {({ submitForm, values, setFieldValue }) => {
          return (
            <Layout.Vertical spacing="xlarge">
              <Accordion activeId="details" collapseProps={{ transitionDuration: 0 }}>
                <Accordion.Panel
                  id="details"
                  summary={getString('pipelineSteps.k8sBGDeploy')}
                  details={
                    <>
                      <FormInput.InputWithIdentifier inputLabel={getString('name')} />
                      <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                        <FormInput.MultiTextInput
                          name="spec.timeout"
                          label={getString('pipelineSteps.timeoutLabel')}
                          className={stepCss.duration}
                          style={{ width: '100%' }}
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
                      <FormMultiTypeCheckboxField
                        name="spec.skipDryRun"
                        label={getString('pipelineSteps.skipDryRun')}
                      />
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

const K8BGDeployInputStep: React.FC<K8BGDeployProps> = ({ onUpdate, initialValues, template }) => {
  const { getString } = useStrings()
  return (
    <>
      {getMultiTypeFromValue(template?.spec?.timeout) === MultiTypeInputType.RUNTIME && (
        <FormGroup label={getString('pipelineSteps.timeoutLabel')}>
          <TextInput
            name="spec.timeout"
            onChange={(event: React.SyntheticEvent<HTMLInputElement>) => {
              onUpdate?.({ ...initialValues, spec: { ...initialValues.spec, timeout: event.currentTarget.value } })
            }}
          />
        </FormGroup>
      )}
      {getMultiTypeFromValue(template?.spec?.skipDryRun) === MultiTypeInputType.RUNTIME && (
        <FormGroup>
          <Checkbox
            name="spec.skipDryRun"
            className={stepCss.checkbox}
            label={getString('pipelineSteps.skipDryRun')}
            onChange={event => {
              onUpdate?.({ ...initialValues, spec: { ...initialValues.spec, skipDryRun: event.currentTarget.checked } })
            }}
          />
        </FormGroup>
      )}
    </>
  )
}

export class K8sBlueGreenDeployStep extends PipelineStep<K8sBGDeployData> {
  renderStep(
    initialValues: K8sBGDeployData,
    onUpdate?: (data: K8sBGDeployData) => void,
    stepViewType?: StepViewType,
    inputSetData?: {
      template?: K8sBGDeployData
    }
  ): JSX.Element {
    if (stepViewType === StepViewType.InputSet || stepViewType === StepViewType.DeploymentForm) {
      return (
        <K8BGDeployInputStep
          initialValues={initialValues}
          onUpdate={onUpdate}
          stepViewType={stepViewType}
          template={inputSetData?.template}
        />
      )
    }
    return <K8BGDeployWidget initialValues={initialValues} onUpdate={onUpdate} stepViewType={stepViewType} />
  }

  validateInputSet(): object {
    return {}
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
