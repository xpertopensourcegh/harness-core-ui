import React from 'react'
import { render } from '@testing-library/react'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import { factory, TestStepWidget } from '../../__tests__/StepTestUtil'
import { K8RolloutDeployStep } from '../K8sRolloutDeployStep'

describe('Test K8sRolloutDeployStep', () => {
  beforeEach(() => {
    factory.registerStep(new K8RolloutDeployStep())
  })
  test('should render edit view as new step', () => {
    const { container } = render(
      <TestStepWidget initialValues={{}} type={StepType.K8sRollingDeploy} stepViewType={StepViewType.Edit} />
    )
    expect(container).toMatchSnapshot()
  })
  test('should render edit view as edit step', () => {
    const { container } = render(
      <TestStepWidget
        initialValues={{
          type: 'K8sRollingDeploy',
          name: 'Test A',
          identifier: 'Test_A',
          spec: { skipDryRun: '${input}', timeout: '10m' }
        }}
        type={StepType.K8sRollingDeploy}
        stepViewType={StepViewType.Edit}
      />
    )
    expect(container).toMatchSnapshot()
  })
  test('should render edit view', () => {
    const { container } = render(
      <TestStepWidget
        initialValues={{ identifier: 'Test_A', type: 'K8sRollingDeploy', spec: { skipDryRun: false } }}
        template={{ identifier: 'Test_A', type: 'K8sRollingDeploy', spec: { skipDryRun: '${input}' } }}
        allValues={{
          type: 'K8sRollingDeploy',
          name: 'Test A',
          identifier: 'Test_A',
          spec: { skipDryRun: '${input}', timeout: '10m' }
        }}
        type={StepType.K8sRollingDeploy}
        stepViewType={StepViewType.InputSet}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
