import React from 'react'
import { Tabs, Tab, Formik, FormikForm, Text, FormInput, Link } from '@wings-software/uikit'
import { debounce } from 'lodash-es'
import type { ExecutionWrapper } from 'services/cd-ng'
import Accordion from '@common/components/Accordion/Accordion'
import i18n from './StepCommands.18n'
import { StepWidget } from '../../AbstractSteps/StepWidget'
import type { AbstractStepFactory } from '../../AbstractSteps/AbstractStepFactory'
import css from './StepCommands.module.scss'

export interface StepCommandsProps {
  step: ExecutionWrapper
  onChange: (step: ExecutionWrapper) => void
  stepsFactory: AbstractStepFactory
  isStepGroup: boolean
}

export enum TabTypes {
  StepConfiguration,
  Advanced
}

interface Values {
  tab?: TabTypes
  skipCondition?: string
  shouldKeepOpen?: boolean
}

const AdvancedStep: React.FC<StepCommandsProps> = ({ step, onChange }) => {
  const handleValidate = (values: Values): void => {
    onChange({ ...values, tab: TabTypes.Advanced, shouldKeepOpen: true })
  }

  const debouncedHandleValidate = React.useRef(debounce(handleValidate, 300)).current

  return (
    <Formik
      initialValues={{ skipCondition: step.skipCondition }}
      validate={debouncedHandleValidate}
      onSubmit={() => {
        //
      }}
    >
      {() => {
        return (
          <FormikForm className={css.form}>
            <div>
              <Accordion>
                <Accordion.Panel
                  id="skipCondition"
                  summary={i18n.skipCondition}
                  details={
                    <>
                      <Text
                        className={css.skipConditionLabel}
                        font={{ weight: 'semi-bold' }}
                        margin={{ bottom: 'large' }}
                      >
                        {i18n.skipConditionLabel}
                      </Text>
                      <FormInput.Text name="skipCondition" label="" />
                      <Text font="small" style={{ whiteSpace: 'break-spaces' }}>
                        {i18n.skipConditionHelpText}
                        <br />
                        <Link font="small" withoutHref>
                          {i18n.learnMore}
                        </Link>
                      </Text>
                    </>
                  }
                />
              </Accordion>
            </div>
          </FormikForm>
        )
      }}
    </Formik>
  )
}

export const StepCommands: React.FC<StepCommandsProps> = ({ step, onChange, isStepGroup, stepsFactory }) => {
  return (
    <div className={css.stepCommand}>
      <div className={css.stepTabs}>
        <Tabs id="step-commands">
          <Tab
            id="step-configuration"
            title={isStepGroup ? i18n.stepGroupConfiguration : i18n.stepConfiguration}
            panel={
              <StepWidget
                factory={stepsFactory}
                initialValues={step}
                onUpdate={onChange}
                type={isStepGroup ? 'StepGroup' : step.type}
              />
            }
          />
          <Tab
            id="advanced"
            title={i18n.advanced}
            panel={
              <AdvancedStep step={step} stepsFactory={stepsFactory} onChange={onChange} isStepGroup={isStepGroup} />
            }
          />
        </Tabs>
      </div>
    </div>
  )
}
