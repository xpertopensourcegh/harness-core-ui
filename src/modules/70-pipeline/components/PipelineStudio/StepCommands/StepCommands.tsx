import React from 'react'
import { Tabs, Tab } from '@wings-software/uicore'
import type { FormikProps } from 'formik'
import { isEmpty } from 'lodash-es'

import { useStrings } from 'framework/exports'
import { StepWidgetWithFormikRef } from '@pipeline/components/AbstractSteps/StepWidget'
import { AdvancedStepsWithRef } from '@pipeline/components/PipelineSteps/AdvancedSteps/AdvancedSteps'

import type { StepCommandsProps } from './StepCommandTypes'
import css from './StepCommands.module.scss'

enum StepCommandTabs {
  StepConfiguration = 'StepConfiguration',
  Advanced = 'Advanced'
}

export const StepCommands: React.FC<StepCommandsProps> = ({
  step,
  onChange,
  isStepGroup,
  stepsFactory,
  hiddenPanels,
  hasStepGroupAncestor
}) => {
  const { getString } = useStrings()
  const [activeTab, setActiveTab] = React.useState(StepCommandTabs.StepConfiguration)
  const stepRef = React.useRef<FormikProps<unknown> | null>(null)
  const advancedConfRef = React.useRef<FormikProps<unknown> | null>(null)

  async function handleTabChange(newTab: StepCommandTabs, prevTab: StepCommandTabs): Promise<void> {
    if (prevTab === StepCommandTabs.StepConfiguration && stepRef.current) {
      // we use this value as a flag for not closing the drawer
      stepRef.current.setFieldValue('shouldKeepOpen', true)

      // please do not remove the await below.
      // This is required for errors to be populated correctly
      await stepRef.current.submitForm()

      if (isEmpty(stepRef.current.errors)) {
        setActiveTab(newTab)
      }

      // reset the flag
      stepRef.current.setFieldValue('shouldKeepOpen', false)
    } else if (prevTab === StepCommandTabs.Advanced && advancedConfRef.current) {
      // we use this value as a flag for not closing the drawer
      advancedConfRef.current.setFieldValue('shouldKeepOpen', true)

      // please do not remove the await below.
      // This is required for errors to be populated correctly
      await advancedConfRef.current.submitForm()

      if (isEmpty(advancedConfRef.current.errors)) {
        setActiveTab(newTab)
      }

      // reset the flag
      advancedConfRef.current.setFieldValue('shouldKeepOpen', true)
    }
  }

  return (
    <div className={css.stepCommand}>
      <div className={css.stepTabs}>
        <Tabs id="step-commands" selectedTabId={activeTab} onChange={handleTabChange} renderAllTabPanels>
          <Tab
            id={StepCommandTabs.StepConfiguration}
            title={isStepGroup ? getString('stepGroupConfiguration') : getString('stepConfiguration')}
            panel={
              <StepWidgetWithFormikRef
                factory={stepsFactory}
                initialValues={step}
                onUpdate={onChange}
                type={isStepGroup ? 'StepGroup' : step.type}
                ref={stepRef}
              />
            }
          />
          <Tab
            id={StepCommandTabs.Advanced}
            title={getString('advancedTitle')}
            panel={
              <AdvancedStepsWithRef
                step={step}
                stepsFactory={stepsFactory}
                onChange={onChange}
                hiddenPanels={hiddenPanels}
                isStepGroup={isStepGroup}
                hasStepGroupAncestor={hasStepGroupAncestor}
                ref={advancedConfRef}
              />
            }
          />
        </Tabs>
      </div>
    </div>
  )
}
