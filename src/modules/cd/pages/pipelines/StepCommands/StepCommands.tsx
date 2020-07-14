import React from 'react'
import type { StepWrapper } from 'services/ng-temp'
import { Layout, Tabs, Tab, Formik, FormInput, Text, MultiTypeInput, Button } from '@wings-software/uikit'
import i18n from './StepCommands.18n'
import { FormGroup } from '@blueprintjs/core'
import css from './StepCommands.module.scss'
import { K8sRolloutDeploy, initialValues as K8sRolloutInitialValues } from './Commands/K8sRolloutDeploy'
import { StepType } from '../ExecutionGraph/ExecutionStepModel'
import { HTTP, initialValues as HTTPInitialValues } from './Commands/HTTP'
import * as Yup from 'yup'

export interface StepCommandsProps {
  step: StepWrapper
  onChange: (step: StepWrapper) => void
}

const getInitialValues = (step: StepWrapper) => {
  if (step.type === StepType.K8sRolloutDeploy) {
    return K8sRolloutInitialValues
  } else if (step.type === StepType.HTTP) {
    return HTTPInitialValues
  }
  return {}
}

const StepConfiguration: React.FC<StepCommandsProps> = ({ step, onChange }) => {
  return (
    <>
      <Text className={css.boldLabel} font={{ size: 'medium' }}>
        {i18n.stepLabel(step.type)}
      </Text>
      <Formik<StepWrapper>
        onSubmit={values => {
          onChange(values)
        }}
        initialValues={{
          name: step.name,
          identifier: step.identifier,
          spec: { ...getInitialValues(step), ...step.spec }
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().required(i18n.stepNameRequired)
        })}
      >
        {({ submitForm }) => {
          return (
            <>
              <FormInput.InputWithIdentifier inputLabel={i18n.displayName} />
              {step.type === StepType.K8sRolloutDeploy && <K8sRolloutDeploy />}
              {step.type === StepType.HTTP && <HTTP />}
              <Button intent="primary" text={i18n.submit} onClick={submitForm} />
            </>
          )
        }}
      </Formik>
    </>
  )
}

const AdvancedStep: React.FC<StepCommandsProps> = ({ step }) => {
  return (
    <Formik
      onSubmit={values => {
        JSON.stringify(values)
      }}
      initialValues={{ condition: step.condition, failureStrategy: step.failureStrategy }}
    >
      {() => {
        return (
          <>
            <Text className={css.boldLabel} font={{ size: 'medium' }}>
              {i18n.skipCondition}
            </Text>
            <FormGroup labelFor="condition" label={i18n.specifyConditionToSkipThisStep}>
              <MultiTypeInput />
            </FormGroup>
            <Text className={css.boldLabel} font={{ size: 'medium' }}>
              {i18n.failureStrategy}
            </Text>
            <FormGroup labelFor="failureStrategy" label={i18n.ifCondition}>
              <MultiTypeInput />
            </FormGroup>
            <FormGroup labelFor="failureStrategy" label={i18n.do}>
              <MultiTypeInput />
            </FormGroup>
            <Text className={css.boldLabel} font={{ size: 'medium' }}>
              {i18n.output}
            </Text>
            <Text>$stages.dev.step.output</Text>
          </>
        )
      }}
    </Formik>
  )
}

export const StepCommands: React.FC<StepCommandsProps> = ({ step, onChange }) => {
  return (
    <Layout.Horizontal style={{ padding: '0 var(--spacing-large)' }}>
      <Tabs id="step-commands">
        <Tab
          id="step-configuration"
          title={i18n.stepConfiguration}
          panel={<StepConfiguration step={step} onChange={onChange} />}
        />
        <Tab id="advanced" title={i18n.advanced} panel={<AdvancedStep step={step} onChange={onChange} />} />
      </Tabs>
    </Layout.Horizontal>
  )
}
