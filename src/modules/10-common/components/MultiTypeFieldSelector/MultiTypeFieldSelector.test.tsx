import React from 'react'
import { render, findByText, fireEvent, waitFor } from '@testing-library/react'
import { Formik, Form } from 'formik'

import { RUNTIME_INPUT_VALUE } from '@wings-software/uikit'
import { TestWrapper } from '@common/utils/testUtils'

import MultiTypeFieldSelector, { MultiTypeFieldSelectorProps } from './MultiTypeFieldSelector'

interface TestProps extends Omit<MultiTypeFieldSelectorProps, 'name' | 'label' | 'children'> {
  initialValues: any
  onSubmit(data: any): void
}

function TestComponent({ onSubmit, initialValues, ...props }: TestProps) {
  return (
    <TestWrapper>
      <Formik onSubmit={onSubmit} initialValues={initialValues}>
        <Form>
          <MultiTypeFieldSelector name="test" label="Test Label" {...props}>
            <div data-testid="children">
              <input type="text" />
            </div>
          </MultiTypeFieldSelector>
          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </TestWrapper>
  )
}

describe('<MultiTypeFieldSelector /> tests', () => {
  test('"Fixed value" renders children', async () => {
    const onSubmit = jest.fn()
    const { container, getByTestId } = render(
      <TestComponent onSubmit={onSubmit} initialValues={{ test: 'Some Value' }} />
    )

    expect(container).toMatchSnapshot('Fixed value')
    expect(getByTestId('children')).toMatchInlineSnapshot(`
      <div
        data-testid="children"
      >
        <input
          type="text"
        />
      </div>
    `)
  })

  test('Change from "Fixed value" to "Runtime input" updates value', async () => {
    const onSubmit = jest.fn()
    const { container, getByTestId } = render(
      <TestComponent onSubmit={onSubmit} initialValues={{ test: 'Some Value' }} />
    )

    const fil = await findByText(container, 'Fixed value')

    fireEvent.click(fil.closest('button')!)

    const ri = await findByText(document.body, 'Runtime input')

    fireEvent.click(ri)

    expect(container).toMatchSnapshot('Runtime input')
    expect(() => getByTestId('children')).toThrow()

    const submit = await findByText(container, 'Submit')

    fireEvent.click(submit)

    await waitFor(() => Promise.resolve())

    expect(onSubmit).toHaveBeenCalledWith(
      {
        test: RUNTIME_INPUT_VALUE
      },
      expect.any(Object)
    )
  })

  test('Detects "Runtime input" correctly', async () => {
    const onSubmit = jest.fn()
    const { container, getByTestId } = render(
      <TestComponent onSubmit={onSubmit} initialValues={{ test: RUNTIME_INPUT_VALUE }} />
    )

    expect(container).toMatchSnapshot('Runtime input')
    expect(() => getByTestId('children')).toThrow()
  })
  test('Change from "Runtime input" to "Fixed value" updates value', async () => {
    const onSubmit = jest.fn()
    const { container, getByTestId } = render(
      <TestComponent onSubmit={onSubmit} initialValues={{ test: RUNTIME_INPUT_VALUE }} />
    )

    const ri = await findByText(document.body, 'Runtime input')
    fireEvent.click(ri)

    const fil = await findByText(document.body, 'Fixed value')
    fireEvent.click(fil)

    expect(container).toMatchSnapshot('Fixed value')
    expect(getByTestId('children')).toMatchInlineSnapshot(`
      <div
        data-testid="children"
      >
        <input
          type="text"
        />
      </div>
    `)

    const submit = await findByText(container, 'Submit')

    fireEvent.click(submit)

    await waitFor(() => Promise.resolve())

    expect(onSubmit).toHaveBeenCalledWith(
      {
        test: undefined
      },
      expect.any(Object)
    )
  })
})
