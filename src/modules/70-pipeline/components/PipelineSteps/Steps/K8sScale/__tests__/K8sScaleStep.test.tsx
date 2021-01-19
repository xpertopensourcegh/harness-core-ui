import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { RUNTIME_INPUT_VALUE } from '@wings-software/uicore'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import { InstanceTypes } from '@common/constants/InstanceTypes'
import { factory, TestStepWidget } from '../../__tests__/StepTestUtil'
import { K8sScaleStep } from '../K8sScaleStep'

describe('Test K8sBlueGreenDeployStep', () => {
  beforeEach(() => {
    factory.registerStep(new K8sScaleStep())
  })
  test('should render edit view as new step', () => {
    const { container } = render(
      <TestStepWidget initialValues={{}} type={StepType.K8sScale} stepViewType={StepViewType.Edit} />
    )
    expect(container).toMatchSnapshot()
  })
  test('should render edit view as edit step with all runtime inputs', () => {
    const { container } = render(
      <TestStepWidget
        initialValues={{
          type: 'K8sScale',
          name: 'Test A',
          identifier: 'Test_A',
          spec: {
            skipDryRun: RUNTIME_INPUT_VALUE,
            timeout: RUNTIME_INPUT_VALUE,
            workload: RUNTIME_INPUT_VALUE,
            instanceSelection: { type: 'Count', spec: { count: RUNTIME_INPUT_VALUE } }
          }
        }}
        type={StepType.K8sScale}
        stepViewType={StepViewType.Edit}
      />
    )
    expect(container).toMatchSnapshot()
  })
  test('should render edit view', () => {
    const { container } = render(
      <TestStepWidget
        initialValues={{
          identifier: 'Test_A',
          type: 'K8sScale',
          spec: {
            skipDryRun: false,
            workload: 'test',
            timeout: '10m',
            instanceSelection: { type: 'Count', spec: { count: 10 } }
          }
        }}
        template={{
          identifier: 'Test_A',
          type: 'K8sScale',
          spec: {
            skipDryRun: RUNTIME_INPUT_VALUE,
            timeout: RUNTIME_INPUT_VALUE,
            workload: RUNTIME_INPUT_VALUE,
            instanceSelection: { type: 'Count', spec: { count: RUNTIME_INPUT_VALUE } }
          }
        }}
        allValues={{
          type: 'K8sScale',
          name: 'Test A',
          identifier: 'Test_A',
          spec: {
            skipDryRun: RUNTIME_INPUT_VALUE,
            timeout: RUNTIME_INPUT_VALUE,
            workload: RUNTIME_INPUT_VALUE,
            instanceSelection: { type: 'Count', spec: { count: RUNTIME_INPUT_VALUE } }
          }
        }}
        type={StepType.K8sScale}
        stepViewType={StepViewType.InputSet}
      />
    )
    expect(container).toMatchSnapshot()
  })

  test('should render edit view', () => {
    const { container } = render(
      <TestStepWidget
        initialValues={{ identifier: 'Test_A', type: 'K8sScale', spec: { skipDryRun: false } }}
        template={{ identifier: 'Test_A', type: 'K8sScale', spec: { skipDryRun: RUNTIME_INPUT_VALUE } }}
        allValues={{
          type: 'K8sScale',
          name: 'Test A',
          identifier: 'Test_A',
          spec: {
            skipDryRun: RUNTIME_INPUT_VALUE,
            timeout: '10m',
            workload: 'test',
            instanceSelection: { type: 'Count', spec: { count: 10 } }
          }
        }}
        type={StepType.K8sScale}
        stepViewType={StepViewType.Edit}
      />
    )
    expect(container).toMatchSnapshot()
  })

  test('should throw validation error without instances', async () => {
    const onUpdate = jest.fn()
    const { container, getByText } = render(
      <TestStepWidget
        initialValues={{
          identifier: 'Test_A',
          type: 'K8sScale',
          spec: { skipDryRun: false, workload: 'test' }
        }}
        type={StepType.K8sScale}
        stepViewType={StepViewType.Edit}
        onUpdate={onUpdate}
      />
    )

    fireEvent.click(getByText('Submit').closest('button')!)

    await waitFor(() => Promise.resolve())
    await waitFor(() => Promise.resolve())
    expect(container).toMatchSnapshot()
    expect(onUpdate).not.toBeCalled()
  })

  test('should submit with valid paylod for instace type count', async () => {
    const onUpdate = jest.fn()
    const { container, getByText } = render(
      <TestStepWidget
        initialValues={{
          identifier: 'Test_A',
          type: 'K8sScale',
          spec: {
            skipDryRun: false,
            timeout: '10m',
            workload: 'test',
            instanceSelection: { type: 'Count', spec: { count: 10 } }
          },
          name: 'Test A'
        }}
        type={StepType.K8sScale}
        stepViewType={StepViewType.Edit}
        onUpdate={onUpdate}
      />
    )
    fireEvent.click(getByText('Submit').closest('button')!)

    await waitFor(() =>
      expect(onUpdate).toHaveBeenCalledWith({
        identifier: 'Test_A',
        name: 'Test A',
        spec: {
          instanceSelection: {
            spec: {
              count: 10
            },
            type: 'Count'
          },
          skipDryRun: false,
          timeout: '10m',
          workload: 'test'
        },
        type: 'K8sScale'
      })
    )
    expect(container).toMatchSnapshot()
    // expect(onUpdate).toBeCalled()
  })

  test('should submit with valid paylod for instace type percentage', async () => {
    const onUpdate = jest.fn()
    const { container, getByText } = render(
      <TestStepWidget
        initialValues={{
          identifier: 'Test_A',
          type: 'K8sScale',
          spec: {
            skipDryRun: false,
            timeout: '10m',
            workload: 'test',
            instanceSelection: {
              spec: {
                percentage: 10
              },
              type: InstanceTypes.Percentage
            }
          },
          name: 'Test A'
        }}
        type={StepType.K8sScale}
        stepViewType={StepViewType.Edit}
        onUpdate={onUpdate}
      />
    )
    fireEvent.click(getByText('Submit').closest('button')!)

    await waitFor(() =>
      expect(onUpdate).toHaveBeenCalledWith({
        identifier: 'Test_A',
        name: 'Test A',
        spec: {
          instanceSelection: {
            spec: {
              percentage: 10
            },
            type: 'Percentage'
          },
          skipDryRun: false,
          timeout: '10m',
          workload: 'test'
        },
        type: 'K8sScale'
      })
    )
    expect(container).toMatchSnapshot()
  })

  test('on Edit view for instance type percentage', async () => {
    const onUpdate = jest.fn()
    const { getByText } = render(
      <TestStepWidget
        initialValues={{
          identifier: 'Test_A',
          name: 'Test A',
          spec: {
            instanceSelection: {
              spec: {
                percentage: 10
              },
              type: 'Percentage'
            },
            skipDryRun: false,
            timeout: '10m',
            workload: 'test'
          },
          type: 'K8sScale'
        }}
        type={StepType.K8sScale}
        stepViewType={StepViewType.Edit}
        onUpdate={onUpdate}
      />
    )
    fireEvent.click(getByText('Submit').closest('button')!)

    await waitFor(() =>
      expect(onUpdate).toHaveBeenCalledWith({
        identifier: 'Test_A',
        name: 'Test A',
        spec: {
          instanceSelection: {
            spec: {
              percentage: 10
            },
            type: 'Percentage'
          },
          skipDryRun: false,
          timeout: '10m',
          workload: 'test'
        },
        type: 'K8sScale'
      })
    )
  })
  test('on Edit view for instance type count', async () => {
    const onUpdate = jest.fn()
    const { getByText } = render(
      <TestStepWidget
        initialValues={{
          identifier: 'Test_A',
          name: 'Test A',
          spec: {
            instanceSelection: {
              spec: {
                count: 10
              },
              type: 'Count'
            },
            skipDryRun: false,
            timeout: '10m',
            workload: 'test'
          },
          type: 'K8sScale'
        }}
        type={StepType.K8sScale}
        stepViewType={StepViewType.Edit}
        onUpdate={onUpdate}
      />
    )
    fireEvent.click(getByText('Submit').closest('button')!)

    await waitFor(() =>
      expect(onUpdate).toHaveBeenCalledWith({
        identifier: 'Test_A',
        name: 'Test A',
        spec: {
          instanceSelection: {
            spec: {
              count: 10
            },
            type: 'Count'
          },
          skipDryRun: false,
          timeout: '10m',
          workload: 'test'
        },
        type: 'K8sScale'
      })
    )
  })
})
