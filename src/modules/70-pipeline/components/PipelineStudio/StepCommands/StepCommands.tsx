import React from 'react'
import { Tabs, Tab } from '@wings-software/uicore'

import { useStrings } from 'framework/exports'
import { StepWidget } from '@pipeline/components/AbstractSteps/StepWidget'
import AdvancedSteps from '@pipeline/components/PipelineSteps/AdvancedSteps/AdvancedSteps'

import type { StepCommandsProps } from './StepCommandTypes'
import css from './StepCommands.module.scss'

export const StepCommands: React.FC<StepCommandsProps> = ({
  step,
  onChange,
  isStepGroup,
  stepsFactory,
  hiddenPanels
}) => {
  const { getString } = useStrings()

  return (
    <div className={css.stepCommand}>
      <div className={css.stepTabs}>
        <Tabs id="step-commands">
          <Tab
            id="step-configuration"
            title={isStepGroup ? getString('stepGroupConfiguration') : getString('stepConfiguration')}
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
            title={getString('advancedTitle')}
            panel={
              <AdvancedSteps
                step={step}
                stepsFactory={stepsFactory}
                onChange={onChange}
                hiddenPanels={hiddenPanels}
                isStepGroup={isStepGroup}
              />
            }
          />
        </Tabs>
      </div>
    </div>
  )
}
