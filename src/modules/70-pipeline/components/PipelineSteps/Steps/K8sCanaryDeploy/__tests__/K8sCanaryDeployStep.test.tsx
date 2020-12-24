import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import { InstanceTypes } from '@common/constants/InstanceTypes'
import { factory, TestStepWidget } from '../../__tests__/StepTestUtil'
import { K8sCanaryDeployStep } from '../K8sCanaryDeployStep'

describe('Test K8sBlueGreenDeployStep', () => {
  beforeEach(() => {
    factory.registerStep(new K8sCanaryDeployStep())
  })
  test('should render edit view as new step', () => {
    const { container } = render(
      <TestStepWidget initialValues={{}} type={StepType.K8sCanaryDeploy} stepViewType={StepViewType.Edit} />
    )
    expect(container).toMatchSnapshot()
  })
  test('should render edit view as edit step with all runtime inputs', () => {
    const { container } = render(
      <TestStepWidget
        initialValues={{
          type: 'K8sCanaryDeploy',
          name: 'Test A',
          identifier: 'Test_A',
          spec: { skipDryRun: '${input}', timeout: '${input}' },
          instances: '${input}',
          instanceType: 'Count'
        }}
        type={StepType.K8sCanaryDeploy}
        stepViewType={StepViewType.Edit}
      />
    )
    expect(container).toMatchSnapshot()
  })
  test('should render edit view', () => {
    const { container } = render(
      <TestStepWidget
        initialValues={{ identifier: 'Test_A', type: 'K8sCanaryDeploy', spec: { skipDryRun: false } }}
        template={{ identifier: 'Test_A', type: 'K8sCanaryDeploy', spec: { skipDryRun: '${input}' } }}
        allValues={{
          type: 'K8sCanaryDeploy',
          name: 'Test A',
          identifier: 'Test_A',
          spec: { skipDryRun: '${input}', timeout: '10m' }
        }}
        type={StepType.K8sCanaryDeploy}
        stepViewType={StepViewType.InputSet}
      />
    )
    expect(container).toMatchSnapshot()
  })

  test('should render edit view', () => {
    const { container } = render(
      <TestStepWidget
        initialValues={{ identifier: 'Test_A', type: 'K8sCanaryDeploy', spec: { skipDryRun: false } }}
        template={{ identifier: 'Test_A', type: 'K8sCanaryDeploy', spec: { skipDryRun: '${input}' } }}
        allValues={{
          type: 'K8sCanaryDeploy',
          name: 'Test A',
          identifier: 'Test_A',
          spec: { skipDryRun: '${input}', timeout: '10m' }
        }}
        type={StepType.K8sCanaryDeploy}
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
          type: 'K8sCanaryDeploy',
          spec: { skipDryRun: false }
        }}
        template={{
          identifier: 'Test_A',
          type: 'K8sCanaryDeploy',
          spec: { skipDryRun: '${input}' }
        }}
        allValues={{
          type: 'K8sCanaryDeploy',
          name: 'Test A',
          identifier: 'Test_A',
          spec: { skipDryRun: '${input}', timeout: '10m' },
          instances: -1,
          instanceType: 'percentage'
        }}
        type={StepType.K8sCanaryDeploy}
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
          type: 'K8sCanaryDeploy',
          spec: { skipDryRun: false, timeout: '10ms' },
          name: 'Test A',
          instances: 10,
          instanceType: InstanceTypes.Instances
        }}
        template={{
          identifier: 'Test_A',
          type: 'K8sCanaryDeploy',
          spec: { skipDryRun: '${input}' }
        }}
        allValues={{
          type: 'K8sCanaryDeploy',
          name: 'Test A',
          identifier: 'Test_A',
          spec: { skipDryRun: '${input}', timeout: '10m' },
          instances: 10,
          instanceType: InstanceTypes.Instances
        }}
        type={StepType.K8sCanaryDeploy}
        stepViewType={StepViewType.Edit}
        onUpdate={onUpdate}
      />
    )
    fireEvent.click(getByText('Submit').closest('button')!)

    await waitFor(() => Promise.resolve())
    await waitFor(() => Promise.resolve())
    expect(container).toMatchSnapshot()
    // expect(onUpdate).toBeCalled()

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
        timeout: '10ms'
      },
      type: 'K8sCanaryDeploy'
    })
  })

  test('should submit with valid paylod for instace type percentage', async () => {
    const onUpdate = jest.fn()
    const { container, getByText } = render(
      <TestStepWidget
        initialValues={{
          identifier: 'Test_A',
          type: 'K8sCanaryDeploy',
          spec: { skipDryRun: false, timeout: '10ms' },
          name: 'Test A',
          instances: 10,
          instanceType: InstanceTypes.Percentage
        }}
        template={{
          identifier: 'Test_A',
          type: 'K8sCanaryDeploy',
          spec: { skipDryRun: '${input}' }
        }}
        allValues={{
          type: 'K8sCanaryDeploy',
          name: 'Test A',
          identifier: 'Test_A',
          spec: { skipDryRun: '${input}', timeout: '10m' },
          instances: 10,
          instanceType: InstanceTypes.Percentage
        }}
        type={StepType.K8sCanaryDeploy}
        stepViewType={StepViewType.Edit}
        onUpdate={onUpdate}
      />
    )
    fireEvent.click(getByText('Submit').closest('button')!)

    await waitFor(() => Promise.resolve())
    await waitFor(() => Promise.resolve())
    expect(container).toMatchSnapshot()
    // expect(onUpdate).toBeCalled()

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
        timeout: '10ms'
      },
      type: 'K8sCanaryDeploy'
    })
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
            timeout: '10ms'
          },
          type: 'K8sCanaryDeploy'
        }}
        template={{
          identifier: 'Test_A',
          type: 'K8sCanaryDeploy',
          spec: { skipDryRun: '${input}' }
        }}
        allValues={{
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
            timeout: '10ms'
          },
          type: 'K8sCanaryDeploy'
        }}
        type={StepType.K8sCanaryDeploy}
        stepViewType={StepViewType.Edit}
        onUpdate={onUpdate}
      />
    )
    fireEvent.click(getByText('Submit').closest('button')!)

    await waitFor(() => Promise.resolve())
    await waitFor(() => Promise.resolve())

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
        timeout: '10ms'
      },
      type: 'K8sCanaryDeploy'
    })
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
            timeout: '10ms'
          },
          type: 'K8sCanaryDeploy'
        }}
        template={{
          identifier: 'Test_A',
          type: 'K8sCanaryDeploy',
          spec: { skipDryRun: '${input}' }
        }}
        allValues={{
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
            timeout: '10ms'
          },
          type: 'K8sCanaryDeploy'
        }}
        type={StepType.K8sCanaryDeploy}
        stepViewType={StepViewType.Edit}
        onUpdate={onUpdate}
      />
    )
    fireEvent.click(getByText('Submit').closest('button')!)

    await waitFor(() => Promise.resolve())
    await waitFor(() => Promise.resolve())

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
        timeout: '10ms'
      },
      type: 'K8sCanaryDeploy'
    })
  })
})
