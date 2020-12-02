import React from 'react'
import { noop } from 'lodash-es'
import { render, fireEvent, queryByText } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { TestWrapper } from '@common/utils/testUtils'

import type { ConnectorInfoDTO } from 'services/cd-ng'
import CreateK8sConnector from '../CreateK8sConnector'
import { mockResponse, mockSecret, usernamePassword, serviceAccount, oidcMock, clientKeyMock } from './k8Mocks'

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

describe('Create k8 connector Wizard', () => {
  test('should form for authtype username', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <CreateK8sConnector hideLightModal={noop} onConnectorCreated={noop} isCreate={true} mock={mockResponse} />
      </TestWrapper>
    )
    // fill step 1
    await act(async () => {
      fireEvent.change(container.querySelector('input[name="name"]')!, {
        target: { value: 'dummy k8' }
      })
    })
    await act(async () => {
      fireEvent.click(container.querySelector('button[type="submit"]')!)
    })
    // step 2
    expect(queryByText(container, 'Manually enter master url and credentials')).toBeDefined()
    await act(async () => {
      fireEvent.change(container.querySelector('input[name="username"]')!, {
        target: { value: 'dummy username' }
      })
    })
    expect(container).toMatchSnapshot()
  })

  test('should form for edit authtype username', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <CreateK8sConnector
          hideLightModal={noop}
          onConnectorCreated={noop}
          isCreate={false}
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
    expect(queryByText(container, 'Manually enter master url and credentials')).toBeDefined()
    expect(container).toMatchSnapshot()
  })

  test('should form for edit authtype serviceAccount', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <CreateK8sConnector
          hideLightModal={noop}
          onConnectorCreated={noop}
          isCreate={false}
          connectorInfo={serviceAccount as ConnectorInfoDTO}
          mock={mockResponse}
        />
      </TestWrapper>
    )

    await act(async () => {
      fireEvent.click(container.querySelector('button[type="submit"]')!)
    })
    // step 2
    expect(queryByText(container, 'Manually enter master url and credentials')).toBeDefined()
    expect(container).toMatchSnapshot()

    //updating connector
    await act(async () => {
      fireEvent.click(container.querySelector('button[type="submit"]')!)
    })

    expect(updateConnector).toBeCalledWith({
      connector: {
        description: 'k8 descriptipn',
        identifier: 'k8',
        name: 'k8Connector',
        orgIdentifier: undefined,
        projectIdentifier: undefined,
        spec: {
          credential: {
            spec: {
              auth: {
                spec: {
                  serviceAccountTokenRef: 'account.k8serviceToken'
                },
                type: 'ServiceAccount'
              },
              masterUrl: '/url'
            },
            type: 'ManualConfig'
          }
        },
        tags: ['k8'],
        type: 'K8sCluster'
      }
    })
  })

  test('should form for edit authtype OIDC', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <CreateK8sConnector
          hideLightModal={noop}
          onConnectorCreated={noop}
          isCreate={false}
          connectorInfo={oidcMock as ConnectorInfoDTO}
          mock={mockResponse}
        />
      </TestWrapper>
    )

    await act(async () => {
      fireEvent.click(container.querySelector('button[type="submit"]')!)
    })
    // step 2
    expect(queryByText(container, 'Manually enter master url and credentials')).toBeDefined()
    expect(container).toMatchSnapshot()
  })
})

test('should form for edit authtype clientKey', async () => {
  const { container } = render(
    <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
      <CreateK8sConnector
        hideLightModal={noop}
        onConnectorCreated={noop}
        isCreate={false}
        connectorInfo={clientKeyMock as ConnectorInfoDTO}
        mock={mockResponse}
      />
    </TestWrapper>
  )

  await act(async () => {
    fireEvent.click(container.querySelector('button[type="submit"]')!)
  })
  // step 2
  expect(queryByText(container, 'Manually enter master url and credentials')).toBeDefined()
  expect(container).toMatchSnapshot()
})
