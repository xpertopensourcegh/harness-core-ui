import React from 'react'
import { render, fireEvent, findByText, act } from '@testing-library/react'

import { TestWrapper } from '@common/utils/testUtils'
import CreateUpdateSecret from '../CreateUpdateSecret'

import mockData from './listSecretManagersMock.json'
import secretDetailsMock from './secretDetailsMock.json'

const mockUpdateTextSecret = jest.fn()

jest.mock('services/cd-ng', () => ({
  usePutSecret: jest.fn().mockImplementation(() => ({ mutate: mockUpdateTextSecret })),
  usePostSecret: jest.fn().mockImplementation(() => ({ mutate: jest.fn() })),
  usePostSecretFileV2: jest.fn().mockImplementation(() => ({ mutate: jest.fn() })),
  usePutSecretFileV2: jest.fn().mockImplementation(() => ({ mutate: jest.fn() })),
  useGetConnectorList: () => mockData
}))

describe('CreateUpdateSecret', () => {
  test('Create Text Secret', () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/secrets" pathParams={{ accountId: 'dummy' }}>
        <CreateUpdateSecret connectorListMockData={mockData as any} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test('Create File Secret', () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/secrets" pathParams={{ accountId: 'dummy' }}>
        <CreateUpdateSecret connectorListMockData={mockData as any} type="SecretFile" />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test('Update Text Secret', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/secrets" pathParams={{ accountId: 'dummy' }}>
        <CreateUpdateSecret connectorListMockData={mockData as any} secret={secretDetailsMock as any} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()

    await act(async () => {
      fireEvent.change(container.querySelector("textarea[name='description']")!, { target: { value: 'new desc' } })
      const submitBtn = await findByText(container, 'Submit')
      fireEvent.click(submitBtn)
    })

    expect(mockUpdateTextSecret).toHaveBeenCalledWith({
      secret: {
        type: 'SecretText',
        name: 'text1',
        identifier: 'text1',
        description: 'new desc',
        tags: {},
        orgIdentifier: undefined,
        projectIdentifier: undefined,
        spec: { secretManagerIdentifier: 'vault1', valueType: 'Inline' }
      }
    })
  })
})
