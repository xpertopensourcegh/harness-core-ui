import React from 'react'
import { AbstractStepFactory } from '@pipeline/components/AbstractSteps/AbstractStepFactory'
import { StepWidget, StepWidgetProps } from '@pipeline/components/AbstractSteps/StepWidget'
import { AppStoreContext, AppStoreContextProps } from 'framework/AppStore/AppStoreContext'
import strings from 'strings/strings.en.yaml'

class StepTestFactory extends AbstractStepFactory {
  protected type = 'test-factory'
}

const value: AppStoreContextProps = {
  projects: [],
  strings,
  updateAppStore: jest.fn()
}

export const factory = new StepTestFactory()

export const TestStepWidget: React.FC<Omit<StepWidgetProps, 'factory'>> = props => {
  return (
    <AppStoreContext.Provider value={value}>
      <StepWidget factory={factory} {...props} />
    </AppStoreContext.Provider>
  )
}
