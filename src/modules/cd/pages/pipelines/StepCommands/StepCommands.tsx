import React from 'react'
import { Tabs, Tab, Formik, FormInput, Text, MultiTypeInput, Button } from '@wings-software/uikit'
import { FormGroup } from '@blueprintjs/core'
import * as Yup from 'yup'
import type { ExecutionWrapper } from 'services/cd-ng'
import i18n from './StepCommands.18n'
import { K8sRolloutDeploy, initialValues as K8sRolloutInitialValues } from './Commands/K8sRolloutDeploy'
import { HTTP, initialValues as HTTPInitialValues } from './Commands/HTTP'
import { StepType } from '../ExecutionGraph/ExecutionGraphUtil'
import { RightBar } from '../RightBar/RightBar'
import css from './StepCommands.module.scss'

export interface StepCommandsProps {
  step: ExecutionWrapper
  onChange: (step: ExecutionWrapper) => void
  isStepGroup: boolean
}

const getInitialValues = (step: ExecutionWrapper): object => {
  if (step.type === StepType.K8sRolloutDeploy) {
    return K8sRolloutInitialValues
  } else if (step.type === StepType.HTTP) {
    return HTTPInitialValues
  }
  return {}
}

const StepConfiguration: React.FC<StepCommandsProps> = ({ step, onChange, isStepGroup }) => {
  return (
    <>
      <Text className={css.boldLabel} font={{ size: 'medium' }}>
        {isStepGroup ? i18n.stepGroup : i18n.stepLabel(step.type)}
      </Text>
      <Formik<ExecutionWrapper>
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

export const StepCommands: React.FC<StepCommandsProps> = ({ step, onChange, isStepGroup }) => {
  return (
    <div className={css.stepCommand}>
      <div className={css.stepTabs}>
        <Tabs id="step-commands">
          <Tab
            id="step-configuration"
            title={isStepGroup ? i18n.stepGroupConfiguration : i18n.stepConfiguration}
            panel={<StepConfiguration step={step} onChange={onChange} isStepGroup={isStepGroup} />}
          />
          <Tab
            id="advanced"
            title={i18n.advanced}
            panel={<AdvancedStep step={step} onChange={onChange} isStepGroup={isStepGroup} />}
          />
        </Tabs>
      </div>
      <RightBar />
    </div>
  )
}
