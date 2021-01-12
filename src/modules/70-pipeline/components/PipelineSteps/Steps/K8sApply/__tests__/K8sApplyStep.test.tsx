import React from 'react'
import { render } from '@testing-library/react'
import { RUNTIME_INPUT_VALUE } from '@wings-software/uicore'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import { factory, TestStepWidget } from '../../__tests__/StepTestUtil'
import { K8sApplyStep } from '../K8sApplyStep'

describe('Test K8sApplyStep', () => {
  beforeEach(() => {
    factory.registerStep(new K8sApplyStep())
  })
  test('should render edit view as new step', () => {
    const { container } = render(
      <TestStepWidget initialValues={{}} type={StepType.K8sApply} stepViewType={StepViewType.Edit} />
    )
    expect(container).toMatchSnapshot()
  })
  test('should render edit view as edit step', () => {
    const { container } = render(
      <TestStepWidget
        initialValues={{
          type: 'K8sApply',
          name: 'Test A',
          identifier: 'Test_A',
          timeout: '10m',

          spec: {
            skipDryRun: RUNTIME_INPUT_VALUE,
            skipSteadyStateCheck: false,
            filePaths: ['test-1', 'test-2']
          }
        }}
        type={StepType.K8sApply}
        stepViewType={StepViewType.Edit}
      />
    )
    expect(container).toMatchSnapshot()
  })
  test('should render edit view', () => {
    const { container } = render(
      <TestStepWidget
        initialValues={{
          type: 'K8sApply',
          name: 'Test A',
          identifier: 'Test_A',
          timeout: '10m',

          spec: {
            skipDryRun: RUNTIME_INPUT_VALUE,
            skipSteadyStateCheck: false,
            filePaths: ['test-1', 'test-2']
          }
        }}
        template={{
          type: 'K8sApply',
          name: 'Test A',
          identifier: 'Test_A',
          timeout: '10m',

          spec: {
            skipDryRun: RUNTIME_INPUT_VALUE,
            skipSteadyStateCheck: false,
            filePaths: ['test-1', 'test-2']
          }
        }}
        allValues={{
          type: 'K8sApply',
          name: 'Test A',
          identifier: 'Test_A',
          timeout: '10m',

          spec: {
            skipDryRun: RUNTIME_INPUT_VALUE,
            skipSteadyStateCheck: false,
            filePaths: ['test-1', 'test-2']
          }
        }}
        type={StepType.K8sApply}
        stepViewType={StepViewType.InputSet}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
