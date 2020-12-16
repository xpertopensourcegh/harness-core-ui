import React from 'react'
import { render, queryByAttribute, fireEvent, act, waitFor } from '@testing-library/react'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import { factory, TestStepWidget } from '../../__tests__/StepTestUtil'
import { HttpStep } from '../HttpStep'

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
        method: '${input}',
        url: '${input}',
        requestBody: '${input}',
        timeout: '${input}',
        headers: '${input}',
        outputVariables: '${input}'
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
        url: '${input}',
        requestBody: '${input}',
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
})
