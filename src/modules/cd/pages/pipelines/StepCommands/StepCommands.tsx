import React from 'react'
import type { StepWrapper } from 'services/ng-temp'
import { Layout, Tabs, Tab, Formik, FormInput, Text, MultiTypeInput } from '@wings-software/uikit'
import i18n from './StepCommands.18n'
import { FormGroup } from '@blueprintjs/core'
import css from './StepCommands.module.scss'

export interface StepCommandsProps {
  step: StepWrapper
}

const StepConfiguration: React.FC<StepCommandsProps> = ({ step }) => {
  return (
    <>
      <Text className={css.boldLabel} font={{ size: 'medium' }}>
        {i18n.stepLabel(step.type)}
      </Text>
      <Formik
        onSubmit={values => {
          JSON.stringify(values)
        }}
        initialValues={{ name: step.name, identifier: step.identifier }}
      >
        {() => {
          return (
            <>
              <FormInput.InputWithIdentifier inputLabel={i18n.displayName} />
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

export const StepCommands: React.FC<StepCommandsProps> = ({ step }) => {
  return (
    <Layout.Horizontal style={{ padding: '0 var(--spacing-large)' }}>
      <Tabs id="step-commands">
        <Tab id="step-configuration" title={i18n.stepConfiguration} panel={<StepConfiguration step={step} />} />
        <Tab id="advanced" title={i18n.advanced} panel={<AdvancedStep step={step} />} />
      </Tabs>
    </Layout.Horizontal>
  )
}
