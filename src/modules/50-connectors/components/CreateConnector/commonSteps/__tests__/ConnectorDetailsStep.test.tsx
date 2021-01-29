import React from 'react'
import { render, fireEvent, queryByAttribute } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { clickSubmit } from '@common/utils/JestFormHelper'
import { TestWrapper } from '@common/utils/testUtils'
import ConnectorDetailsStep from '../ConnectorDetailsStep'

jest.mock('services/cd-ng', () => ({
  validateTheIdentifierIsUniquePromise: jest
    .fn()
    .mockImplementation(() => Promise.resolve({ status: 'SUCCESS', data: true }))
}))

describe('Connector details step', () => {
  test('Test for  create  connector step one required feilds', async () => {
    const { container } = render(
      <TestWrapper>
        <ConnectorDetailsStep name="sample-name" type="K8sCluster" />
      </TestWrapper>
    )
    // fill step 1
    await act(async () => {
      clickSubmit(container)
    })

    expect(container).toMatchSnapshot() // Form validation for all required fields in step one
  })

  test('Test for going to next step', async () => {
    const { container } = render(
      <TestWrapper>
        <ConnectorDetailsStep name="sample-name" type="K8sCluster" />
      </TestWrapper>
    )

    // fill step 1
    const nameInput = queryByAttribute('name', container, 'name')
    expect(nameInput).toBeTruthy()
    if (nameInput) fireEvent.change(nameInput, { target: { value: 'dummy name' } })

    await act(async () => {
      clickSubmit(container)
    })
    //step 2
    expect(container).toMatchSnapshot()
  })
})
