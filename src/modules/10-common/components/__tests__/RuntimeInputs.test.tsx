import React from 'react'
import { render } from '@testing-library/react'
import { Formik, FormikForm } from '@wings-software/uikit'
import { FormMultiTypeCheckboxField } from '../MultiTypeCheckbox/MultiTypeCheckbox'
import { FormMultiTypeRadioGroupField } from '../MultiTypeRadioGroup/MultiTypeRadioGroup'
import { FormMultiTypeTextAreaField } from '../MultiTypeTextArea/MultiTypeTextArea'

const onSubmit = jest.fn()

const SampleComponent: React.FC<{
  checkboxValue?: boolean | string
  radioValue?: string
  textAreaValue?: string
}> = props => {
  return (
    <Formik initialValues={props} onSubmit={onSubmit}>
      <FormikForm>
        <FormMultiTypeCheckboxField name="checkboxValue" label="CheckBox" />
        <FormMultiTypeRadioGroupField
          name="radioValue"
          label="RadioGroup"
          options={[
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' }
          ]}
        />
        <FormMultiTypeTextAreaField name="textAreaValue" label="TextArea" />
      </FormikForm>
    </Formik>
  )
}

describe('RuntimeInput Tests for checkbox, RadioGroup and Text Area', () => {
  test('should render without default values', () => {
    const { container } = render(<SampleComponent />)
    expect(container).toMatchSnapshot()
  })
  test('should render with default fixed values', () => {
    const { container } = render(<SampleComponent textAreaValue="Hi" checkboxValue={true} radioValue="option2" />)
    expect(container).toMatchSnapshot()
  })
  test('should render with default runtimeInput values', () => {
    const { container } = render(
      <SampleComponent textAreaValue="${input}" checkboxValue="${input}" radioValue="${input}" />
    )
    expect(container).toMatchSnapshot()
  })
})
