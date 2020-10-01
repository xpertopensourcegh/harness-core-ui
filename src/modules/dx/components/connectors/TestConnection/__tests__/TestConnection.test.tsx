import React from 'react'
import { render, act, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { TestWrapper } from 'modules/common/utils/testUtils'
import statusData from 'modules/dx/common/VerifyOutOfClusterDelegate/__tests__/mockData/delegate-status-response.json'
import testConnectionSuccess from 'modules/dx/common/VerifyOutOfClusterDelegate/__tests__/mockData/test-connection-success.json'
import type { RestResponseDelegateStatus } from 'services/portal'
import type { ResponseConnectorValidationResult } from 'services/cd-ng'
import { Connectors } from 'modules/dx/constants'
import TestConnection from '../TestConnection'

describe('Test Connection', () => {
  test('render test connection', () => {
    const { container, getByText } = render(
      <TestWrapper path="/account/:accountId" pathParams={{ accountId: 'dummy' }}>
        <MemoryRouter>
          <TestConnection
            connectorType={Connectors.KUBERNETES_CLUSTER}
            connectorName="Test Connector"
            connectorIdentifier="connectorId"
            setLastTested={jest.fn()}
            delegateStatusMockData={{
              data: statusData as RestResponseDelegateStatus,
              loading: false
            }}
            testConnectionMockData={{
              data: testConnectionSuccess as ResponseConnectorValidationResult,
              loading: false
            }}
          />
        </MemoryRouter>
      </TestWrapper>
    )
    expect(getByText('Test Connection')).toBeDefined()
    expect(container).toMatchSnapshot()
  })

  test('render test connection verify out of cluster ', async () => {
    const { container, getByText } = render(
      <TestWrapper path="/account/:accountId" pathParams={{ accountId: 'dummy' }}>
        <MemoryRouter>
          <TestConnection
            connectorType={Connectors.KUBERNETES_CLUSTER}
            connectorName="Test Connector"
            connectorIdentifier="connectorId"
            setLastTested={jest.fn()}
            delegateStatusMockData={{
              data: statusData as RestResponseDelegateStatus,
              loading: false
            }}
            testConnectionMockData={{
              data: testConnectionSuccess as ResponseConnectorValidationResult,
              loading: false
            }}
          />
        </MemoryRouter>
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
    const testBtn = container.querySelector('[class*="testButton"]')
    expect(testBtn).not.toBeNull()
    expect(getByText('Test Connection')).toBeDefined()
    if (testBtn) {
      await act(async () => {
        fireEvent.click(testBtn)
      })
    }
    expect(getByText('Verifying Connection')).toBeDefined()
    expect(container).toMatchSnapshot()
  })

  test('render test connection verify existing delegate ', async () => {
    const { container, getByText } = render(
      <TestWrapper path="/account/:accountId" pathParams={{ accountId: 'dummy' }}>
        <MemoryRouter>
          <TestConnection
            connectorType={Connectors.KUBERNETES_CLUSTER}
            connectorName="Test Connector"
            connectorIdentifier="connectorId"
            delegateName="Sample Delegate Name"
            setLastTested={jest.fn()}
            delegateStatusMockData={{
              data: statusData as RestResponseDelegateStatus,
              loading: false
            }}
            testConnectionMockData={{
              data: testConnectionSuccess as ResponseConnectorValidationResult,
              loading: false
            }}
          />
        </MemoryRouter>
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
    const testBtn = container.querySelector('[class*="testButton"]')
    expect(testBtn).not.toBeNull()
    expect(getByText('Test Connection')).toBeDefined()
    if (testBtn) {
      await act(async () => {
        fireEvent.click(testBtn)
      })
    }
    expect(getByText('Delegate found: Sample Delegate Name')).toBeDefined()
    expect(container).toMatchSnapshot()
  })
})
