import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { RUNTIME_INPUT_VALUE } from '@wings-software/uicore'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import { InstanceTypes } from '@common/constants/InstanceTypes'
import { factory, TestStepWidget } from '../../__tests__/StepTestUtil'
import { K8sCanaryDeployStep } from '../K8sCanaryDeployStep'

jest.mock('@common/components/YAMLBuilder/YamlBuilder', () => ({ children }: { children: JSX.Element }) => (
  <div>{children}</div>
))

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
          spec: {
            skipDryRun: RUNTIME_INPUT_VALUE,
            timeout: RUNTIME_INPUT_VALUE,
            instanceSelection: {
              spec: {
                count: RUNTIME_INPUT_VALUE
              },
              type: 'Count'
            }
          }
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
        template={{
          identifier: 'Test_A',
          type: 'K8sCanaryDeploy',
          spec: {
            skipDryRun: RUNTIME_INPUT_VALUE,
            timeout: RUNTIME_INPUT_VALUE,
            instanceSelection: {
              spec: {
                count: RUNTIME_INPUT_VALUE
              },
              type: 'Count'
            }
          }
        }}
        allValues={{
          type: 'K8sCanaryDeploy',
          name: 'Test A',
          identifier: 'Test_A',
          spec: {
            skipDryRun: RUNTIME_INPUT_VALUE,
            timeout: RUNTIME_INPUT_VALUE,
            instanceSelection: {
              spec: {
                count: RUNTIME_INPUT_VALUE
              },
              type: 'Count'
            }
          }
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
        initialValues={{
          identifier: 'Test_A',
          type: 'K8sCanaryDeploy',
          spec: { skipDryRun: false, timeout: '10m', instanceSelection: { type: 'Count', spec: { count: 20 } } }
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
        type={StepType.K8sCanaryDeploy}
        stepViewType={StepViewType.Edit}
        onUpdate={onUpdate}
      />
    )

    fireEvent.click(getByText('Submit').closest('button')!)

    await waitFor(() => expect(onUpdate).not.toBeCalled())
    expect(container).toMatchSnapshot()
  })

  test('should submit with valid paylod for instace type count', async () => {
    const onUpdate = jest.fn()
    const { container, getByText } = render(
      <TestStepWidget
        initialValues={{
          identifier: 'Test_A',
          type: 'K8sCanaryDeploy',
          timeout: '10m',
          spec: { skipDryRun: false, instanceSelection: { type: 'Count', spec: { count: 20 } } },
          name: 'Test A'
        }}
        type={StepType.K8sCanaryDeploy}
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
              count: 20
            },
            type: 'Count'
          },
          skipDryRun: false
        },
        timeout: '10m',
        type: 'K8sCanaryDeploy'
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
          type: 'K8sCanaryDeploy',
          timeout: '10m',
          spec: {
            skipDryRun: false,

            instanceSelection: {
              spec: {
                percentage: 20
              },
              type: InstanceTypes.Percentage
            }
          },
          name: 'Test A'
        }}
        type={StepType.K8sCanaryDeploy}
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
              percentage: 20
            },
            type: 'Percentage'
          },
          skipDryRun: false
        },
        timeout: '10m',
        type: 'K8sCanaryDeploy'
      })
    )
    expect(container).toMatchSnapshot()
    // expect(onUpdate).toBeCalled()
  })

  test('on Edit view for instance type percentage', async () => {
    const onUpdate = jest.fn()
    const { getByText } = render(
      <TestStepWidget
        initialValues={{
          identifier: 'Test_A',
          name: 'Test A',
          timeout: '10m',
          spec: {
            instanceSelection: {
              spec: {
                percentage: 10
              },
              type: 'Percentage'
            },
            skipDryRun: false
          },
          type: 'K8sCanaryDeploy'
        }}
        type={StepType.K8sCanaryDeploy}
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
          skipDryRun: false
        },
        timeout: '10m',
        type: 'K8sCanaryDeploy'
      })
    )
  })
})
