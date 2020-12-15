import React from 'react'
import { AbstractStepFactory } from '@pipeline/components/AbstractSteps/AbstractStepFactory'
import { StepWidget, StepWidgetProps } from '@pipeline/components/AbstractSteps/StepWidget'
import { TestWrapper } from '@common/utils/testUtils'

class StepTestFactory extends AbstractStepFactory {
  protected type = 'test-factory'
}

export const factory = new StepTestFactory()

export const TestStepWidget: React.FC<Omit<StepWidgetProps, 'factory'>> = props => {
  return (
    <TestWrapper>
      <StepWidget factory={factory} {...props} />
    </TestWrapper>
  )
}
