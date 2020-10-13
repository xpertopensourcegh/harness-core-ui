import React from 'react'
import { render, fireEvent, findByText, act } from '@testing-library/react'

import { TestWrapper } from 'modules/common/utils/testUtils'
import SecretDetails from '../SecretDetails'

import mockData from './secretDetailsMocks.json'

jest.mock('modules/common/components/YAMLBuilder/YamlBuilder', jest.fn())

describe('Secret Details', () => {
  test('Text Secret', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/secrets" pathParams={{ accountId: 'dummy' }}>
        <SecretDetails
          mockSecretDetails={mockData.text as any}
          connectorListMockData={mockData.secretManagers as any}
        />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot('view text')

    await act(async () => {
      const $editButton = await findByText(container, 'Edit Details')
      fireEvent.click($editButton)
    })

    expect(container).toMatchSnapshot('edit text')
  })
  test('File Secret', () => {
    const { container } = render(
      <TestWrapper
        path="/account/:accountId/org/:orgIdentifier/resources/secrets"
        pathParams={{ accountId: 'dummy', orgIdentifier: 'dummy' }}
      >
        <SecretDetails mockSecretDetails={mockData.file as any} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
  test('SSH Secret with Key', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/secrets" pathParams={{ accountId: 'dummy' }}>
        <SecretDetails
          mockSecretDetails={mockData.sshKey as any}
          mockPassword={mockData.text.data as any}
          mockPassphrase={mockData.text.data as any}
          mockKey={mockData.file.data as any}
        />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot('view ssh')

    await act(async () => {
      const $editButton = await findByText(container, 'Edit Details')
      fireEvent.click($editButton)
    })

    expect(container).toMatchSnapshot('edit ssh')
  })
})
