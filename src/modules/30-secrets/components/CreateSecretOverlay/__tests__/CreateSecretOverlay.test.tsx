import React from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import type { SecretDTOV2, SecretSpecDTO } from 'services/cd-ng'
import { TestWrapper } from '@common/utils/testUtils'
import { Vault } from './mockData'
import CreateSecretOverlay from '../CreateSecretOverlay'

const secretTextCreateProps = {
  type: 'SecretText' as SecretDTOV2['type'],
  setShowCreateSecretModal: jest.fn(),
  onSuccess: jest.fn()
}

describe('Create Secret Overlay', () => {
  test('render create successfully', () => {
    const { container, getByText } = render(
      <TestWrapper path="/account/:accountId" pathParams={{ accountId: 'dummy' }}>
        <MemoryRouter>
          <CreateSecretOverlay
            {...secretTextCreateProps}
            connectorListMockData={{
              data: Vault as any,
              loading: false
            }}
          />
        </MemoryRouter>
      </TestWrapper>
    )
    expect(getByText('Create Secret')).toBeDefined()
    expect(container).toMatchSnapshot()
  })

  test('render edit secret successfully', () => {
    const { container, getByText } = render(
      <TestWrapper path="/account/:accountId" pathParams={{ accountId: 'dummy' }}>
        <MemoryRouter>
          <CreateSecretOverlay
            {...secretTextCreateProps}
            editSecretData={{
              type: 'SecretText',
              name: 'Secret Name',
              identifier: 'secretId',
              spec: {
                value: 'secretvalue',
                valueType: 'Inline',
                secretManagerIdentifier: 'secretManagerIdentifier'
              } as SecretSpecDTO
            }}
            connectorListMockData={{
              data: Vault as any,
              loading: false
            }}
          />
        </MemoryRouter>
      </TestWrapper>
    )
    expect(getByText('Modify Secret')).toBeDefined()
    expect(container).toMatchSnapshot()
  })
})
