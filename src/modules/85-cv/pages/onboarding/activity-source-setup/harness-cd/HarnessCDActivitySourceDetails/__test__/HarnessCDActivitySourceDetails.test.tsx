import React from 'react'
import { render, act, fireEvent } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { InputTypes, setFieldValue } from '@common/utils/JestFormHelper'
import HarnessCDActivitySourceDetails from '../HarnessCDActivitySourceDetails'

describe('HarnessCDActivitySourceDetails snapshot test', () => {
  test('initializes ok', async () => {
    const { container } = render(
      <TestWrapper pathParams={{ accountId: 'dummy', orgIdentifier: 'dummy', projectIdentifier: 'dummy' }}>
        <HarnessCDActivitySourceDetails initialValues={{}} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test('onSubmit is called', async () => {
    const onSubmit = jest.fn()
    const { container } = render(
      <TestWrapper pathParams={{ accountId: 'dummy', orgIdentifier: 'dummy', projectIdentifier: 'dummy' }}>
        <HarnessCDActivitySourceDetails initialValues={{}} onSubmit={onSubmit} />
      </TestWrapper>
    )

    await setFieldValue({
      container,
      type: InputTypes.TEXTFIELD,
      fieldId: 'name',
      value: 'TestName'
    })

    await act(async () => {
      fireEvent.click(container.querySelector('button[type="submit"]')!)
    })

    expect(onSubmit).toHaveBeenCalledWith({
      identifier: 'TestName',
      name: 'TestName'
    })
  })
})
