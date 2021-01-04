import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'
import { RUNTIME_INPUT_VALUE } from '@wings-software/uikit'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import { Barrier } from '../Barrier.stories'

describe('Test Barrier Step', () => {
  test('should render edit view', () => {
    const { container } = render(
      <Barrier
        type={StepType.Barrier}
        initialValues={{ identifier: 'Test_A', type: StepType.Barrier }}
        stepViewType={StepViewType.Edit}
      />
    )
    expect(container).toMatchSnapshot()
  })
  test('should render inputSet view', () => {
    const { container } = render(
      <Barrier
        type={StepType.Barrier}
        initialValues={{ identifier: 'Test_A', type: StepType.Barrier }}
        stepViewType={StepViewType.InputSet}
        path=""
        template={{
          identifier: 'Test_A',
          type: StepType.Barrier,
          spec: { timeout: RUNTIME_INPUT_VALUE }
        }}
        allValues={{
          type: StepType.Barrier,
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
      <Barrier
        type={StepType.Barrier}
        initialValues={{ identifier: 'Test_A', type: StepType.Barrier }}
        stepViewType={StepViewType.InputSet}
        path=""
        template={{
          identifier: 'Test_A',
          type: StepType.Barrier,
          spec: { timeout: RUNTIME_INPUT_VALUE }
        }}
        allValues={{
          type: StepType.Barrier,
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
