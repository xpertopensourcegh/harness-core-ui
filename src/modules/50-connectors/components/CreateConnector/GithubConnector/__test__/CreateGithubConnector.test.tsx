import React from 'react'
import { noop } from 'lodash-es'
import { render, fireEvent, queryByText } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { TestWrapper } from '@common/utils/testUtils'
import { InputTypes, setFieldValue } from '@common/utils/JestFormHelper'

import type { ConnectorInfoDTO } from 'services/cd-ng'
import i18n from '@common/components/AddDescriptionAndTags/AddDescriptionAndTags.i18n'
import CreateGithubConnector from '../CreateGithubConnector'
import { mockResponse, mockSecret, usernamePassword, usernameTokenWithAPIAccess } from './githubMocks'

const updateConnector = jest.fn()
jest.mock('services/portal', () => ({
  useGetDelegateTags: jest.fn().mockImplementation(() => ({ mutate: jest.fn() }))
}))

jest.mock('services/cd-ng', () => ({
  validateTheIdentifierIsUniquePromise: jest.fn().mockImplementation(() => Promise.resolve(mockResponse)),
  useCreateConnector: jest.fn().mockImplementation(() => ({ mutate: jest.fn() })),
  useUpdateConnector: jest.fn().mockImplementation(() => ({ mutate: updateConnector })),
  getSecretV2Promise: jest.fn().mockImplementation(() => Promise.resolve(mockSecret))
}))

describe('Create Github connector Wizard', () => {
  test('Gitsub step one', async () => {
    const description = 'dummy description'

    const { container, getByText } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <CreateGithubConnector
          hideLightModal={noop}
          onConnectorCreated={noop}
          isEditMode={false}
          connectorInfo={(null as unknown) as void}
          mock={mockResponse}
        />
      </TestWrapper>
    )

    expect(queryByText(container, 'Name')).not.toBeNull()
    fireEvent.click(getByText(i18n.addDescriptionLabel))
    setFieldValue({
      type: InputTypes.TEXTAREA,
      container: container,
      fieldId: 'description',
      value: description
    })
    // test for retaining values on toggling form fields
    fireEvent.click(getByText('remove')) //removing description
    expect(container).toMatchSnapshot() // matching snapshot with description and tags hidden
    fireEvent.click(getByText(i18n.addDescriptionLabel)) //showing description
    fireEvent.click(getByText(i18n.addTagsLabel)) //showing tags
    expect(container).toMatchSnapshot()
  })

  test('should form for edit http and authtype username', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <CreateGithubConnector
          hideLightModal={noop}
          onConnectorCreated={noop}
          isEditMode={true}
          connectorInfo={usernamePassword as ConnectorInfoDTO}
          mock={mockResponse}
        />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
    await act(async () => {
      fireEvent.click(container.querySelector('button[type="submit"]')!)
    })
    // step 2
    expect(queryByText(container, 'Enable API access')).toBeDefined()
    expect(container).toMatchSnapshot()
  })

  test('should form for edit http and authtype username-token with API access', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <CreateGithubConnector
          hideLightModal={noop}
          onConnectorCreated={noop}
          isEditMode={true}
          connectorInfo={usernameTokenWithAPIAccess as ConnectorInfoDTO}
          mock={mockResponse}
        />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
    await act(async () => {
      fireEvent.click(container.querySelector('button[type="submit"]')!)
    })
    // step 2
    expect(queryByText(container, 'Enable API access')).toBeDefined()
    expect(container).toMatchSnapshot()
  })
})
