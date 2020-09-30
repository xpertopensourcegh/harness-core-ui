import React from 'react'
import { MemoryRouter } from 'react-router'
import { render } from '@testing-library/react'
import type { ResponseConnectorValidationResult } from 'services/cd-ng'
import type { RestResponseDelegateStatus } from 'services/portal'
import VerifyExistingDelegate from '../VerifyExistingDelegate'
import statusData from '../../VerifyOutOfClusterDelegate/__tests__/mockData/delegate-status-response.json'
import testConnectionSuccess from '../../VerifyOutOfClusterDelegate/__tests__/mockData/test-connection-success.json'

describe('Verification step for existing delegate', () => {
  test('render VerifyExistingDelegate when delegate does not exist', () => {
    const { container, getByText } = render(
      <MemoryRouter>
        <VerifyExistingDelegate
          name="sample-name"
          connectorName="Test Connector"
          delegateName="Incorrect Delegate Name"
          delegateStatusMockData={{
            data: statusData as RestResponseDelegateStatus,
            loading: false
          }}
          testConnectionMockData={{
            data: testConnectionSuccess as ResponseConnectorValidationResult,
            loading: false
          }}
          type="K8sCluster"
        />
      </MemoryRouter>
    )

    expect(getByText('Delegate not found')).toBeDefined()
    expect(getByText('Test Connector')).toBeDefined()
    expect(getByText('Verifying connection')).toBeDefined()
    expect(container).toMatchSnapshot()
  })
  test('render VerifyExistingDelegate when delegate exist', () => {
    const { container, getByText } = render(
      <MemoryRouter>
        <VerifyExistingDelegate
          name="sample-name"
          connectorName="Test Connector"
          delegateName="Sample Delegate Name"
          delegateStatusMockData={{
            data: statusData as RestResponseDelegateStatus,
            loading: false
          }}
          testConnectionMockData={{
            data: testConnectionSuccess as ResponseConnectorValidationResult,
            loading: false
          }}
          type="K8sCluster"
        />
      </MemoryRouter>
    )
    expect(getByText('Delegate found: Sample Delegate Name')).toBeDefined()
    expect(getByText('Test Connector')).toBeDefined()
    expect(getByText('Verifying connection')).toBeDefined()
    expect(container).toMatchSnapshot()
  })
})
