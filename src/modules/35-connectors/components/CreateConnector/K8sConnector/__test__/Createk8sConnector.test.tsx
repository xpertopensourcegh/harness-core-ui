import React from 'react'
import { noop } from 'lodash-es'
import { render, fireEvent, queryByText } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { TestWrapper } from '@common/utils/testUtils'
import CreateK8sConnector from '../CreateK8sConnector'
import { backButtonTest } from '../../commonTest'
import {
  mockResponse,
  mockSecret,
  usernamePassword,
  serviceAccount,
  oidcMock,
  clientKeyMock,
  backButtonMock
} from './k8Mocks'

const commonProps = {
  accountId: 'dummy',
  orgIdentifier: '',
  projectIdentifier: '',
  setIsEditMode: noop,
  onClose: noop,
  onSuccess: noop
}
const updateConnector = jest.fn()
const createConnector = jest.fn()
jest.mock('services/portal', () => ({
  useGetDelegateTags: jest.fn().mockImplementation(() => ({ mutate: jest.fn() })),
  useGetDelegateFromId: jest.fn().mockImplementation(() => jest.fn())
}))

jest.mock('services/cd-ng', () => ({
  validateTheIdentifierIsUniquePromise: jest.fn().mockImplementation(() => Promise.resolve(mockResponse)),
  useCreateConnector: jest.fn().mockImplementation(() => ({ mutate: createConnector })),
  useUpdateConnector: jest.fn().mockImplementation(() => ({ mutate: updateConnector })),
  getSecretV2Promise: jest.fn().mockImplementation(() => Promise.resolve(mockSecret)),
  useGetTestConnectionResult: jest.fn().mockImplementation(() => jest.fn())
}))

describe('Create k8 connector Wizard', () => {
  test('should form for authtype username', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <CreateK8sConnector {...commonProps} isEditMode={false} connectorInfo={undefined} mock={mockResponse} />
      </TestWrapper>
    )
    // fill step 1
    await act(async () => {
      fireEvent.change(container.querySelector('input[name="name"]')!, {
        target: { value: 'dummy k8' }
      })
    })

    expect(container).toMatchSnapshot()
    await act(async () => {
      fireEvent.click(container.querySelector('button[type="submit"]')!)
    })
    // step 2

    expect(container).toMatchSnapshot()
  })

  test('should form for edit authtype username', async () => {
    updateConnector.mockReset()
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <CreateK8sConnector {...commonProps} isEditMode={true} connectorInfo={usernamePassword} mock={mockResponse} />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
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
        name: 'k87',
        orgIdentifier: '',
        projectIdentifier: '',
        spec: {
          credential: {
            spec: {
              auth: {
                spec: {
                  passwordRef: 'account.k8serviceToken',
                  username: 'dev',
                  usernameRef: undefined
                },
                type: 'UsernamePassword'
              },
              masterUrl: '/url7878'
            },
            type: 'ManualConfig'
          }
        },
        tags: { k8: '' },
        type: 'K8sCluster'
      }
    })
  })

  test('should form for edit authtype serviceAccount', async () => {
    updateConnector.mockReset()
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <CreateK8sConnector {...commonProps} isEditMode={true} connectorInfo={serviceAccount} mock={mockResponse} />
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
        orgIdentifier: '',
        projectIdentifier: '',
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
        tags: { k8: '' },
        type: 'K8sCluster'
      }
    })
  })

  test('should form for edit authtype OIDC', async () => {
    updateConnector.mockReset()
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <CreateK8sConnector {...commonProps} isEditMode={true} connectorInfo={oidcMock} mock={mockResponse} />
      </TestWrapper>
    )

    await act(async () => {
      fireEvent.click(container.querySelector('button[type="submit"]')!)
    })
    // step 2
    expect(queryByText(container, 'Manually enter master url and credentials')).toBeDefined()
    expect(container).toMatchSnapshot()
    await act(async () => {
      fireEvent.click(container.querySelector('button[type="submit"]')!)
    })

    expect(updateConnector).toBeCalledWith({
      connector: {
        description: 'k8 descriptipn',
        identifier: 'k8Connector',
        name: 'k8Connector',
        orgIdentifier: '',
        projectIdentifier: '',
        spec: {
          credential: {
            spec: {
              auth: {
                spec: {
                  oidcClientIdRef: 'account.clientKey',
                  oidcIssuerUrl: 'issueUrl',
                  oidcPasswordRef: 'clientPassphrase',
                  oidcScopes: 'account',
                  oidcSecretRef: 'org.k8certificate',
                  oidcUsername: 'OIDC username ',
                  oidcUsernameRef: undefined
                },
                type: 'OpenIdConnect'
              },
              masterUrl: '/url'
            },
            type: 'ManualConfig'
          }
        },
        tags: { k8: '' },
        type: 'K8sCluster'
      }
    })
  })

  backButtonTest({
    Element: (
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <CreateK8sConnector {...commonProps} isEditMode={true} connectorInfo={backButtonMock} mock={mockResponse} />
      </TestWrapper>
    ),
    backButtonSelector: '[data-name="k8sBackButton"]',
    mock: backButtonMock
  })
})

test('should form for edit authtype clientKey', async () => {
  updateConnector.mockReset()
  const { container } = render(
    <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
      <CreateK8sConnector {...commonProps} isEditMode={true} connectorInfo={clientKeyMock} mock={mockResponse} />
    </TestWrapper>
  )

  await act(async () => {
    fireEvent.click(container.querySelector('button[type="submit"]')!)
  })

  expect(container).toMatchSnapshot()
  expect(queryByText(container, 'Manually enter master url and credentials')).toBeDefined()

  //updating connector
  await act(async () => {
    fireEvent.click(container.querySelector('button[type="submit"]')!)
  })

  expect(updateConnector).toBeCalledWith({
    connector: {
      description: 'k8 descriptipn',
      identifier: 'k8',
      name: 'k8Connector',
      orgIdentifier: '',
      projectIdentifier: '',
      spec: {
        credential: {
          spec: {
            auth: {
              spec: {
                caCertRef: 'account.b12',
                clientCertRef: 'account.b13',
                clientKeyAlgo: null,
                clientKeyPassphraseRef: 'account.k8serviceToken',
                clientKeyRef: 'account.k8serviceToken'
              },
              type: 'ClientKeyCert'
            },
            masterUrl: '/url'
          },
          type: 'ManualConfig'
        }
      },
      tags: { k8: '' },
      type: 'K8sCluster'
    }
  })
  expect(container).toMatchSnapshot()
})
