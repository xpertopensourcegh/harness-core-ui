import React from 'react'
import { noop } from 'lodash-es'
import { render, fireEvent, queryByText } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { TestWrapper } from '@common/utils/testUtils'
import type { ConnectorInfoDTO } from 'services/cd-ng'
import { mockResponse, mockSecret, mockConnector } from './mocks'
import CreateArtifactoryConnector from '../CreateArtifactoryConnector'

const commonProps = {
  accountId: 'dummy',
  orgIdentifier: '',
  projectIdentifier: '',
  setIsEditMode: noop,
  onClose: noop,
  onSuccess: noop
}

const createConnector = jest.fn()
const updateConnector = jest.fn()
jest.mock('services/portal', () => ({
  useGetDelegateTags: jest.fn().mockImplementation(() => ({ mutate: jest.fn() }))
}))

jest.mock('services/cd-ng', () => ({
  validateTheIdentifierIsUniquePromise: jest.fn().mockImplementation(() => Promise.resolve(mockResponse)),
  useCreateConnector: jest.fn().mockImplementation(() => ({ mutate: createConnector })),
  useUpdateConnector: jest.fn().mockImplementation(() => ({ mutate: updateConnector })),
  getSecretV2Promise: jest.fn().mockImplementation(() => Promise.resolve(mockSecret))
}))

describe('Create Artifactory connector Wizard', () => {
  test('Should render form', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <CreateArtifactoryConnector {...commonProps} isEditMode={false} connectorInfo={undefined} />
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

    // match step 2
    expect(container).toMatchSnapshot()
  })

  test('Should be able to edit connector', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <CreateArtifactoryConnector
          {...commonProps}
          isEditMode={true}
          connectorInfo={mockConnector as ConnectorInfoDTO}
          mock={mockResponse}
        />
      </TestWrapper>
    )
    // editing connector name
    await act(async () => {
      fireEvent.change(container.querySelector('input[name="name"]')!, {
        target: { value: 'dummy name' }
      })
    })

    await act(async () => {
      fireEvent.click(container.querySelector('button[type="submit"]')!)
    })
    // step 2
    expect(queryByText(container, 'Artifactory Repository URL')).not.toBeNull()
    expect(container).toMatchSnapshot()

    //updating connector
    await act(async () => {
      fireEvent.click(container.querySelector('button[type="submit"]')!)
    })
    expect(updateConnector).toBeCalledWith({
      connector: {
        description: 'connectorDescription',
        identifier: 'ArtifactoryTest',
        name: 'dummy name',
        orgIdentifier: '',
        projectIdentifier: '',
        spec: {
          artifactoryServerUrl: 'dummyRespositoryUrl',
          auth: {
            spec: {
              passwordRef: 'account.connectorPass',
              username: 'dev'
            },
            type: 'UsernamePassword'
          }
        },
        tags: {},
        type: 'Artifactory'
      }
    })
  })
})
