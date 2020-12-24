import React from 'react'
import { render } from '@testing-library/react'
import { Formik, Form } from 'formik'
import { TestWrapper } from '@common/utils/testUtils'
import { InstanceDropdownField, InstanceTypes, FormInstanceDropdown } from '../InstanceDropdownField'

const props = {
  label: 'Instance',
  name: 'instances',

  value: { instance: 0, instanceType: InstanceTypes.Instances },
  onChange: jest.fn()
}

describe('Unit tests for InstanceDropdownField Component', () => {
  test('render the component', () => {
    const { container } = render(
      <TestWrapper>
        <InstanceDropdownField {...props} />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
  })

  test('render the Formik component', () => {
    const onSubmit = jest.fn()
    const initialValues = {
      instanceType: ''
    }
    const { container } = render(
      <TestWrapper>
        <Formik onSubmit={onSubmit} initialValues={initialValues}>
          <Form>
            <FormInstanceDropdown {...props} typeName="instanceType" />
          </Form>
        </Formik>
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
  })
})
