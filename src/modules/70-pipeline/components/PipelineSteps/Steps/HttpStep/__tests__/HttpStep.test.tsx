import React from 'react'
import { render, queryByAttribute, fireEvent, act, waitFor } from '@testing-library/react'
import { RUNTIME_INPUT_VALUE } from '@wings-software/uicore'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import { factory, TestStepWidget } from '../../__tests__/StepTestUtil'
import { HttpStep } from '../HttpStep'

jest.mock('@common/components/YAMLBuilder/YamlBuilder', () => ({ children }: { children: JSX.Element }) => (
  <div>{children}</div>
))

describe('Http Step', () => {
  beforeAll(() => {
    factory.registerStep(new HttpStep())
  })

  test('should render edit view as new step', () => {
    const { container } = render(
      <TestStepWidget initialValues={{}} type={StepType.HTTP} stepViewType={StepViewType.Edit} />
    )

    expect(container).toMatchSnapshot()
  })

  test('renders runtime inputs', () => {
    const initialValues = {
      identifier: 'My_Http_Step',
      name: 'My Http Step',
      spec: {
        method: RUNTIME_INPUT_VALUE,
        url: RUNTIME_INPUT_VALUE,
        requestBody: RUNTIME_INPUT_VALUE,
        timeout: RUNTIME_INPUT_VALUE,
        assertion: RUNTIME_INPUT_VALUE
        // headers: RUNTIME_INPUT_VALUE
        // outputVariables: RUNTIME_INPUT_VALUE
      }
    }
    const { container } = render(
      <TestStepWidget initialValues={initialValues} type={StepType.HTTP} stepViewType={StepViewType.Edit} />
    )

    expect(container).toMatchSnapshot()
  })

  test('edit mode works', () => {
    const initialValues = {
      identifier: 'My_Http_Step',
      name: 'My Http Step',
      spec: {
        method: 'POST',
        url: RUNTIME_INPUT_VALUE,
        requestBody: RUNTIME_INPUT_VALUE,
        assertion: RUNTIME_INPUT_VALUE,
        timeout: '10s',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json'
          }
        ],
        outputVariables: [
          {
            name: 'myVar',
            type: 'String',
            value: 'response.message'
          }
        ]
      }
    }
    const { container } = render(
      <TestStepWidget initialValues={initialValues} type={StepType.HTTP} stepViewType={StepViewType.Edit} />
    )

    expect(container).toMatchSnapshot()
  })

  test('form produces correct data for fixed inputs', async () => {
    const onUpdate = jest.fn()
    const { container, getByTestId, getByText } = render(
      <TestStepWidget initialValues={{}} type={StepType.HTTP} stepViewType={StepViewType.Edit} onUpdate={onUpdate} />
    )

    const queryByNameAttribute = (name: string): HTMLElement | null => queryByAttribute('name', container, name)
    const addHeader = getByTestId('add-header')

    act(() => {
      fireEvent.click(addHeader)
      // fireEvent.click(addHeader)
      // fireEvent.click(addHeader)
    })

    fireEvent.change(queryByNameAttribute('name')!, { target: { value: 'My Http Step' } })
    fireEvent.change(queryByNameAttribute('spec.url')!, { target: { value: 'https://someapi.com/v3' } })
    fireEvent.change(queryByNameAttribute('spec.assertion')!, { target: { value: '${httpResponseBody} == 200' } })
    fireEvent.change(queryByNameAttribute('spec.headers[0].key')!, { target: { value: 'Content-Type' } })
    fireEvent.change(queryByNameAttribute('spec.headers[0].value')!, { target: { value: 'application/json' } })
    fireEvent.change(queryByNameAttribute('spec.requestBody')!, {
      target: { value: '{ "message": "Hello world!" }' }
    })

    fireEvent.click(getByText('Response Mapping'))

    fireEvent.change(queryByNameAttribute('spec.outputVariables[0].name')!, { target: { value: 'myVar' } })
    fireEvent.change(queryByNameAttribute('spec.outputVariables[0].value')!, { target: { value: 'response.message' } })

    fireEvent.click(getByText('Submit').closest('button')!)

    await waitFor(() => Promise.resolve())
    await waitFor(() => Promise.resolve())

    expect(onUpdate).toHaveBeenCalledWith({
      identifier: 'My_Http_Step',
      name: 'My Http Step',
      spec: {
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json'
          }
        ],
        method: 'GET',
        assertion: '${httpResponseBody} == 200',
        outputVariables: [
          {
            name: 'myVar',
            type: 'String',
            value: 'response.message'
          }
        ],
        timeout: '10s',
        url: 'https://someapi.com/v3'
      }
    })
  })

  test('renders input sets', () => {
    const onUpdate = jest.fn()
    const initialValues = {
      identifier: 'My_Http_Step',
      name: 'My Http Step',
      spec: {
        method: RUNTIME_INPUT_VALUE,
        url: RUNTIME_INPUT_VALUE,
        requestBody: RUNTIME_INPUT_VALUE,
        timeout: RUNTIME_INPUT_VALUE,
        assertion: RUNTIME_INPUT_VALUE
        // headers: RUNTIME_INPUT_VALUE
        // outputVariables: RUNTIME_INPUT_VALUE
      }
    }
    const { container } = render(
      <TestStepWidget
        initialValues={{}}
        template={initialValues}
        type={StepType.HTTP}
        stepViewType={StepViewType.InputSet}
        onUpdate={onUpdate}
        path=""
      />
    )

    expect(container).toMatchSnapshot()
  })

  test('renders empty input sets', () => {
    const { container } = render(
      <TestStepWidget
        initialValues={{}}
        type={StepType.HTTP}
        stepViewType={StepViewType.InputSet}
        template={{}}
        path=""
      />
    )

    expect(container).toMatchSnapshot()
  })
})
