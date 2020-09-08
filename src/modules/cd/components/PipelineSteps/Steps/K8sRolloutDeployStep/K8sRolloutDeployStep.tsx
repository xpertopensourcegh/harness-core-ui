import React from 'react'
import { IconName, Text, Formik, FormInput, Button, DurationInput } from '@wings-software/uikit'
import * as Yup from 'yup'
import get from 'lodash.get'
import { Step, StepViewType } from 'modules/common/exports'
import type { K8sRollingStepInfo, StepElement } from 'services/cd-ng'
import { StepType } from '../../PipelineStepInterface'
import i18n from './K8sRolloutDeployStep.i18n'
import stepCss from '../Steps.module.scss'

export interface K8RolloutDeployData extends Omit<StepElement, 'spec'> {
  spec: K8sRollingStepInfo
}

interface K8RolloutDeployProps {
  initialValues: K8RolloutDeployData
  onUpdate?: (data: K8RolloutDeployData) => void
  stepViewType?: StepViewType
}

const K8RolloutDeployWidget: React.FC<K8RolloutDeployProps> = ({ initialValues, onUpdate }): JSX.Element => {
  return (
    <>
      <Text className={stepCss.boldLabel} font={{ size: 'medium' }}>
        {i18n.k8sRolloutDeploy}
      </Text>
      <Formik<K8RolloutDeployData>
        onSubmit={values => {
          onUpdate?.(values)
        }}
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          name: Yup.string().required(i18n.stepNameRequired)
        })}
      >
        {({ submitForm }) => {
          return (
            <>
              <FormInput.InputWithIdentifier inputLabel={i18n.displayName} />
              <FormInput.CustomRender
                name="spec.timeout"
                label={i18n.timeout}
                className={stepCss.duration}
                render={formik => {
                  return (
                    <DurationInput
                      value={get(formik.values, 'spec.timeout')}
                      onChange={time => formik.setFieldValue('spec.timeout', time)}
                    />
                  )
                }}
              />
              <FormInput.CheckBox name="spec.skipDryRun" label={i18n.skipDryRun} className={stepCss.checkbox} />
              <Button intent="primary" text={i18n.submit} onClick={submitForm} />
            </>
          )
        }}
      </Formik>
    </>
  )
}

export class K8RolloutDeployStep extends Step<K8RolloutDeployData> {
  renderStep(
    initialValues: K8RolloutDeployData,
    onUpdate?: (data: K8RolloutDeployData) => void,
    stepViewType?: StepViewType
  ): JSX.Element {
    return <K8RolloutDeployWidget initialValues={initialValues} onUpdate={onUpdate} stepViewType={stepViewType} />
  }

  protected type = StepType.K8sRollingDeploy
  protected stepName = i18n.k8sRolloutDeploy
  protected stepIcon: IconName = 'service-kubernetes'

  protected defaultValues: K8RolloutDeployData = {
    spec: {
      skipDryRun: false,
      timeout: 60000
    }
  }
}
