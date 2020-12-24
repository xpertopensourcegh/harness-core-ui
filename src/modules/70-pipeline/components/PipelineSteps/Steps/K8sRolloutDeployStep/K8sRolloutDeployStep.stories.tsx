import React from 'react'
import type { Meta, Story } from '@storybook/react'
// import { select } from '@storybook/addon-knobs'
// import yaml from 'yaml'
import { Card } from '@wings-software/uikit'
import { stringify } from 'yaml'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import type { StepWidgetProps } from '@pipeline/components/AbstractSteps/StepWidget'
import { factory, TestStepWidget } from '../__tests__/StepTestUtil'
import { K8RolloutDeployStep } from './K8sRolloutDeployStep'
factory.registerStep(new K8RolloutDeployStep())

export default {
  title: 'Pipelines / Pipeline Steps / K8sRolloutDeployStep',
  // eslint-disable-next-line react/display-name
  component: TestStepWidget,
  argTypes: {
    type: { control: { disable: true } },
    stepViewType: {
      control: {
        type: 'inline-radio',
        options: Object.keys(StepViewType)
      }
    },
    onUpdate: { control: { disable: true } },
    initialValues: {
      control: {
        type: 'object'
      }
    }
  }
} as Meta

export const K8sRolloutDeployStep: Story<Omit<StepWidgetProps, 'factory'>> = args => {
  const [value, setValue] = React.useState({})
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '480px 1fr', columnGap: '20px' }}>
      <Card>
        <TestStepWidget {...args} onUpdate={setValue} />
      </Card>
      <Card>
        <pre>{stringify(value)}</pre>
      </Card>
    </div>
  )
}
K8sRolloutDeployStep.args = {
  initialValues: { identifier: 'Test_A', type: StepType.K8sRollingDeploy },
  type: StepType.K8sRollingDeploy,
  stepViewType: StepViewType.Edit,
  path: '',
  template: {
    identifier: 'Test_A',
    type: StepType.K8sRollingDeploy,
    spec: { skipDryRun: '${input}', timeout: '${input}' }
  },
  allValues: {
    type: StepType.K8sRollingDeploy,
    name: 'Test A',
    identifier: 'Test_A',
    spec: { skipDryRun: '${input}', timeout: '${input}' }
  }
}
