import React from 'react'
import { noop } from 'lodash-es'
import { render, fireEvent, queryByText } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { TestWrapper } from '@common/utils/testUtils'
import { InputTypes, fillAtForm, clickSubmit } from '@common/utils/JestFormHelper'

import type { ConnectorInfoDTO } from 'services/cd-ng'
import i18n from '@common/components/AddDescriptionAndTags/AddDescriptionAndTags.i18n'
import { GitUrlType, GitConnectionType } from '@connectors/pages/connectors/utils/ConnectorUtils'
import CreateGitConnector from '../CreateGitConnector'
import { mockResponse, mockSecret, usernamePassword } from './gitMocks'

const updateConnector = jest.fn()
const createConnector = jest.fn()
jest.mock('services/portal', () => ({
  useGetDelegateTags: jest.fn().mockImplementation(() => ({ mutate: jest.fn() })),
  useGetDelegatesStatus: jest.fn().mockImplementation(() => {
    return { data: {}, refetch: jest.fn(), error: null, loading: false }
  })
}))

jest.mock('services/cd-ng', () => ({
  validateTheIdentifierIsUniquePromise: jest.fn().mockImplementation(() => Promise.resolve(mockResponse)),
  useCreateConnector: jest.fn().mockImplementation(() => ({ mutate: createConnector })),
  useUpdateConnector: jest.fn().mockImplementation(() => ({ mutate: updateConnector })),
  getSecretV2Promise: jest.fn().mockImplementation(() => Promise.resolve(mockSecret)),
  useGetTestConnectionResult: jest.fn().mockImplementation(() => jest.fn())
}))

describe('Create Git connector Wizard', () => {
  test('Git step one', async () => {
    const description = 'dummy description'

    const { container, getByText } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <CreateGitConnector
          setIsEditMode={noop}
          hideLightModal={noop}
          onConnectorCreated={noop}
          isEditMode={false}
          connectorInfo={(null as unknown) as void}
          mock={mockResponse}
          accountId="dummy"
          orgIdentifier=""
          projectIdentifier=""
        />
      </TestWrapper>
    )

    expect(queryByText(container, 'Name')).not.toBeNull()
    fireEvent.click(getByText(i18n.addDescriptionLabel))
    // fill step 1
    fillAtForm([
      {
        container,
        type: InputTypes.TEXTFIELD,
        fieldId: 'name',
        value: 'dummyname'
      },
      {
        container,
        type: InputTypes.TEXTAREA,
        fieldId: 'description',
        value: description
      },
      {
        container,
        type: InputTypes.RADIOS,
        fieldId: 'urlType',
        value: GitUrlType.ACCOUNT
      },
      {
        container,
        type: InputTypes.RADIOS,
        fieldId: 'connectionType',
        value: GitConnectionType.HTTPS
      },
      {
        container,
        type: InputTypes.TEXTFIELD,
        fieldId: 'url',
        value: 'githubTestUrl'
      }
    ])

    // test for retaining values on toggling form fields
    fireEvent.click(getByText('remove')) //removing description
    expect(container).toMatchSnapshot() // matching snapshot with description and tags hidden
    fireEvent.click(getByText(i18n.addDescriptionLabel)) //showing description
    fireEvent.click(getByText(i18n.addTagsLabel)) //showing tags
    expect(container).toMatchSnapshot()
    await act(async () => {
      clickSubmit(container)
    })
    //step 2
    expect(container).toMatchSnapshot()
    await act(async () => {
      clickSubmit(container)
    })
    expect(container).toMatchSnapshot() //Form validation for required fields
    expect(createConnector).toBeCalledTimes(0)
  })

  test('should form for edit http and authtype username', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <CreateGitConnector
          setIsEditMode={noop}
          hideLightModal={noop}
          onConnectorCreated={noop}
          isEditMode={true}
          connectorInfo={usernamePassword as ConnectorInfoDTO}
          mock={mockResponse}
          accountId="dummy"
          orgIdentifier=""
          projectIdentifier=""
        />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
    await act(async () => {
      fireEvent.click(container.querySelector('button[type="submit"]')!)
    })
    // step 2
    expect(container).toMatchSnapshot()
    //updating connector
    await act(async () => {
      fireEvent.click(container.querySelector('button[type="submit"]')!)
    })

    expect(updateConnector).toBeCalledTimes(1)
    expect(updateConnector).toBeCalledWith({
      connector: {
        name: 'dumyGit',
        identifier: 'dumyGit',
        description: '',
        orgIdentifier: '',
        projectIdentifier: '',
        tags: {},
        type: 'Git',
        spec: {
          url: 'dumyGitUrl',
          branchName: 'master',
          type: 'Http',
          connectionType: 'Account',
          spec: { username: 'dev', passwordRef: 'account.connectorPass' }
        }
      }
    })
  })
})
