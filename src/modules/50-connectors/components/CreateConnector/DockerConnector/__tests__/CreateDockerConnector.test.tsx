import React from 'react'
import { noop } from 'lodash-es'
import { render, fireEvent, queryByText } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { TestWrapper } from '@common/utils/testUtils'
import type { ConnectorInfoDTO } from 'services/cd-ng'
import CreateDockerConnector from '../CreateDockerConnector'
import { mockResponse, dockerMock, mockSecret } from './mocks'

const createConnector = jest.fn()
const updateConnector = jest.fn()
jest.mock('services/cd-ng', () => ({
  validateTheIdentifierIsUniquePromise: jest.fn().mockImplementation(() => Promise.resolve(mockResponse)),
  useCreateConnector: jest.fn().mockImplementation(() => ({ mutate: createConnector })),
  useUpdateConnector: jest.fn().mockImplementation(() => ({ mutate: updateConnector })),
  getSecretV2Promise: jest.fn().mockImplementation(() => Promise.resolve(mockSecret))
}))

describe('Create Docker Connector  Wizard', () => {
  test('Should render form', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <CreateDockerConnector hideLightModal={noop} onConnectorCreated={noop} mock={mockResponse} isEditMode={false} />
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

  test('Should render form for editing provider type', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <CreateDockerConnector
          hideLightModal={noop}
          onConnectorCreated={noop}
          isEditMode={true}
          connectorInfo={dockerMock as ConnectorInfoDTO}
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
    expect(container).toMatchSnapshot()
    await act(async () => {
      fireEvent.click(container.querySelector('button[type="submit"]')!)
    })
    // step 2
    expect(queryByText(container, 'Docker Registry URL')).toBeDefined()
    expect(container).toMatchSnapshot()

    //updating connector
    await act(async () => {
      fireEvent.click(container.querySelector('button[type="submit"]')!)
    })

    expect(updateConnector).toBeCalledWith({
      connector: {
        description: 'devConnector description',
        identifier: 'devConnector',
        name: 'dummy name',
        orgIdentifier: undefined,
        projectIdentifier: undefined,
        spec: {
          auth: { type: 'UsernamePassword', spec: { username: 'dev', passwordRef: 'account.b13' } },
          dockerRegistryUrl: 'url-v3',
          providerType: 'DockerHub'
        },
        tags: {},
        type: 'DockerRegistry'
      }
    })
  })
})
