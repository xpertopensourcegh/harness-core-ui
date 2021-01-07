import React from 'react'
import { fireEvent, queryByAttribute, render, waitFor } from '@testing-library/react'
import { RUNTIME_INPUT_VALUE } from '@wings-software/uicore'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import { factory, TestStepWidget } from '../../__tests__/StepTestUtil'
import { ShellScriptStep } from '../ShellScriptStep'

describe('Test Shell Script Step', () => {
  beforeEach(() => {
    factory.registerStep(new ShellScriptStep())
  })

  test('should render edit view as new step', () => {
    const { container } = render(
      <TestStepWidget initialValues={{}} type={StepType.SHELLSCRIPT} stepViewType={StepViewType.Edit} />
    )

    expect(container).toMatchSnapshot()
  })

  test('renders runtime inputs', () => {
    const initialValues = {
      type: 'ShellScript',
      identifier: 'ShellScript',
      name: 'SSH',
      spec: {
        shell: 'Bash',
        executionTarget: {
          host: RUNTIME_INPUT_VALUE,
          connectionType: RUNTIME_INPUT_VALUE,
          connectorRef: RUNTIME_INPUT_VALUE,
          workingDirectory: RUNTIME_INPUT_VALUE
        },
        environmentVariables: [
          {
            name: 'testInput1',
            type: 'String',
            value: RUNTIME_INPUT_VALUE
          },
          {
            name: 'testInput2',
            type: 'String',
            value: RUNTIME_INPUT_VALUE
          }
        ],
        outputVariables: [
          {
            name: 'testOutput1',
            type: 'String',
            value: RUNTIME_INPUT_VALUE
          },
          {
            name: 'testOutput2',
            type: 'String',
            value: RUNTIME_INPUT_VALUE
          }
        ]
      }
    }
    const { container } = render(
      <TestStepWidget initialValues={initialValues} type={StepType.SHELLSCRIPT} stepViewType={StepViewType.Edit} />
    )

    expect(container).toMatchSnapshot()
  })

  test('should render edit view as edit step', () => {
    const initialValues = {
      type: 'ShellScript',
      identifier: 'ShellScript',
      name: 'SSH',
      spec: {
        shell: 'Bash',
        executionTarget: {
          host: 'targethost',
          connectionType: 'SSH',
          connectorRef: 'connectorRef',
          workingDirectory: './temp'
        },
        environmentVariables: [
          {
            name: 'testInput1',
            type: 'String',
            value: 'Test_A'
          },
          {
            name: 'testInput2',
            type: 'String',
            value: 'Test_B'
          }
        ],
        outputVariables: [
          {
            name: 'testOutput1',
            type: 'String',
            value: 'Test_C'
          },
          {
            name: 'testOutput2',
            type: 'String',
            value: 'Test_D'
          }
        ]
      }
    }
    const { container } = render(
      <TestStepWidget initialValues={initialValues} type={StepType.SHELLSCRIPT} stepViewType={StepViewType.Edit} />
    )

    expect(container).toMatchSnapshot()
  })

  test('should render edit view', () => {
    const initialValues = {
      type: 'ShellScript',
      identifier: 'ShellScript',
      name: 'SSH',
      spec: {
        shell: 'Bash',
        onDelegate: 'targethost',
        source: {
          type: 'Inline',
          spec: {
            script: 'test script'
          }
        },
        executionTarget: {
          host: 'targethost',
          connectionType: 'SSH',
          connectorRef: 'connectorRef',
          workingDirectory: './temp'
        },
        environmentVariables: [
          {
            name: 'testInput1',
            type: 'String',
            value: 'Test_A'
          },
          {
            name: 'testInput2',
            type: 'String',
            value: 'Test_B'
          }
        ],
        outputVariables: [
          {
            name: 'testOutput1',
            value: 'Test_C'
          },
          {
            name: 'testOutput2',
            value: 'Test_D'
          }
        ]
      }
    }
    const { container } = render(
      <TestStepWidget initialValues={initialValues} type={StepType.SHELLSCRIPT} stepViewType={StepViewType.Edit} />
    )

    expect(container).toMatchSnapshot()
  })

  test('form produces correct data for fixed inputs', async () => {
    const onUpdate = jest.fn()
    const { container, getByText } = render(
      <TestStepWidget
        initialValues={{}}
        type={StepType.SHELLSCRIPT}
        stepViewType={StepViewType.Edit}
        onUpdate={onUpdate}
      />
    )

    const queryByNameAttribute = (name: string): HTMLElement | null => queryByAttribute('name', container, name)

    fireEvent.change(queryByNameAttribute('name')!, { target: { value: 'SSH' } })
    fireEvent.change(queryByNameAttribute('spec.shell')!, { target: { value: 'BASH' } })
    // fireEvent.change(queryByNameAttribute('spec.onDelegate')!, { target: { value: 'delegate' } })
    fireEvent.change(queryByNameAttribute('spec.source.spec.script')!, { target: { value: 'script test' } })

    fireEvent.click(getByText('Script Input Variables'))

    fireEvent.change(queryByNameAttribute('spec.environmentVariables[0].name')!, { target: { value: 'testInput1' } })
    fireEvent.change(queryByNameAttribute('spec.environmentVariables[0].value')!, {
      target: { value: 'response.message' }
    })
    fireEvent.click(getByText('Add Input Variable'))

    fireEvent.change(queryByNameAttribute('spec.environmentVariables[1].name')!, { target: { value: 'testInput2' } })
    fireEvent.change(queryByNameAttribute('spec.environmentVariables[1].type')!, { target: { value: 'String' } })
    fireEvent.change(queryByNameAttribute('spec.environmentVariables[1].value')!, {
      target: { value: 'response.message' }
    })

    fireEvent.click(getByText('Execution Target'))
    fireEvent.change(queryByNameAttribute('spec.executionTarget.host')!, { target: { value: 'targethost' } })
    // fireEvent.change(queryByNameAttribute('spec.executionTarget.connectorRef')!, { target: { value: '' } })
    fireEvent.change(queryByNameAttribute('spec.executionTarget.workingDirectory')!, { target: { value: './temp' } })

    fireEvent.click(getByText('Script Output Variables'))
    fireEvent.change(queryByNameAttribute('spec.outputVariables[0].name')!, { target: { value: 'testOutput1' } })
    fireEvent.change(queryByNameAttribute('spec.outputVariables[0].value')!, { target: { value: 'response.message' } })
    fireEvent.click(getByText('Add'))

    fireEvent.change(queryByNameAttribute('spec.outputVariables[1].name')!, { target: { value: 'testOutput2' } })
    fireEvent.change(queryByNameAttribute('spec.outputVariables[1].value')!, { target: { value: 'response.message' } })

    fireEvent.click(getByText('Submit').closest('button')!)

    await waitFor(() => Promise.resolve())
    await waitFor(() => Promise.resolve())

    expect(onUpdate).toHaveBeenCalledWith({
      identifier: 'SSH',
      name: 'SSH',
      spec: {
        shell: 'BASH',
        onDelegate: 'targethost',
        source: {
          type: 'Inline',
          spec: {
            script: ''
          }
        },
        executionTarget: {
          host: 'targethost',
          connectorRef: '',
          workingDirectory: './temp'
        },
        environmentVariables: [
          {
            name: 'testInput1',
            type: 'String',
            value: 'response.message'
          },
          {
            name: 'testInput2',
            type: 'String',
            value: 'response.message'
          }
        ],
        outputVariables: [
          {
            name: 'testOutput1',
            value: 'response.message'
          },
          {
            name: 'testOutput2',
            value: 'response.message'
          }
        ]
      }
    })
  })
})
