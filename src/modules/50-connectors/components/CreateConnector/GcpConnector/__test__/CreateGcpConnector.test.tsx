import React from 'react'
import { noop } from 'lodash-es'
import { render, fireEvent } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { TestWrapper } from '@common/utils/testUtils'
import { InputTypes, setFieldValue } from '@common/utils/JestFormHelper'
import type { ResponseBoolean } from 'services/cd-ng'
import CreateGcpConnector from '../CreateGcpConnector'

const mockResponse: ResponseBoolean = {
  status: 'SUCCESS',
  data: true,
  metaData: {},
  correlationId: ''
}

jest.mock('services/portal', () => ({
  useGetDelegateTags: jest.fn().mockImplementation(() => ({ mutate: jest.fn() }))
}))

jest.mock('services/cd-ng', () => ({
  validateTheIdentifierIsUniquePromise: jest.fn().mockImplementation(() => Promise.resolve(mockResponse)),
  useCreateConnector: jest.fn().mockImplementation(() => ({ mutate: jest.fn() })),
  useUpdateConnector: jest.fn().mockImplementation(() => ({ mutate: jest.fn() }))
}))

describe('Create GCP connector Wizard', () => {
  test('should render form', async () => {
    const { container, getByText } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <CreateGcpConnector hideLightModal={noop} onConnectorCreated={noop} mock={mockResponse} />
      </TestWrapper>
    )

    // fill step 1
    await act(async () => {
      fireEvent.change(container.querySelector('input[name="name"]')!, {
        target: { value: 'dummy name' }
      })
    })
    // match step 1
    expect(container).toMatchSnapshot()

    await act(async () => {
      fireEvent.click(container.querySelector('button[type="submit"]')!)
    })

    // match step 2 auth delegate
    expect(container).toMatchSnapshot()

    setFieldValue({ type: InputTypes.RADIOS, container: container, fieldId: 'authType', value: 'encryptedKey' })

    // match step 2 auth encryptedKey
    expect(container).toMatchSnapshot()

    const backButton = getByText('BACK')
    fireEvent.click(backButton)
    // match step 1
    expect(container).toMatchSnapshot()
  })
})
