import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'
import { RUNTIME_INPUT_VALUE } from '@wings-software/uicore'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import { K8sRollingRollback } from '../K8sRollingRollback.stories'

jest.mock('@common/components/YAMLBuilder/YamlBuilder', () => ({ children }: { children: JSX.Element }) => (
  <div>{children}</div>
))

describe('Test K8sRollingRollback Step', () => {
  test('should render edit view', () => {
    const { container } = render(
      <K8sRollingRollback
        type={StepType.K8sRollingRollback}
        initialValues={{ identifier: 'Test_A', type: StepType.K8sRollingRollback }}
        stepViewType={StepViewType.Edit}
      />
    )
    expect(container).toMatchSnapshot()
  })
  test('should render inputSet view', () => {
    const { container } = render(
      <K8sRollingRollback
        type={StepType.K8sRollingRollback}
        initialValues={{ identifier: 'Test_A', type: StepType.K8sRollingRollback }}
        stepViewType={StepViewType.InputSet}
        path=""
        template={{
          identifier: 'Test_A',
          type: StepType.K8sRollingRollback,
          spec: { timeout: RUNTIME_INPUT_VALUE }
        }}
        allValues={{
          type: StepType.K8sRollingRollback,
          name: 'Test A',
          identifier: 'Test_A',
          spec: { timeout: RUNTIME_INPUT_VALUE }
        }}
      />
    )
    expect(container).toMatchSnapshot()
  })
  test('should render inputSet view and test validation', async () => {
    const { container, getByText } = render(
      <K8sRollingRollback
        type={StepType.K8sRollingRollback}
        initialValues={{ identifier: 'Test_A', type: StepType.K8sRollingRollback }}
        stepViewType={StepViewType.InputSet}
        path=""
        template={{
          identifier: 'Test_A',
          type: StepType.K8sRollingRollback,
          spec: { timeout: RUNTIME_INPUT_VALUE }
        }}
        allValues={{
          type: StepType.K8sRollingRollback,
          name: 'Test A',
          identifier: 'Test_A',
          spec: { timeout: RUNTIME_INPUT_VALUE }
        }}
      />
    )
    await act(async () => {
      fireEvent.click(getByText('Submit'))
    })
    expect(container).toMatchSnapshot()
  })
})
