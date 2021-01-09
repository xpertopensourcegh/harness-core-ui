import React from 'react'
import { MemoryRouter } from 'react-router'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import VerifyOutOfClusterDelegate from '../VerifyOutOfClusterDelegate'
import delegateNameresponse from './mockData/delegate-name-response-error.json'
import testConnectionSuccess from './mockData/test-connection-success.json'

jest.mock('services/portal', () => ({
  useGetDelegateFromId: jest.fn().mockImplementation(() => {
    return { ...delegateNameresponse, refetch: jest.fn(), error: null, loading: false }
  })
}))

describe('Verification step for out of cluster delegate', () => {
  test('render VerifyOutOfClusterDelegate for K8s in edit screen', () => {
    const { container } = render(
      <MemoryRouter>
        <TestWrapper>
          <VerifyOutOfClusterDelegate
            type="K8sCluster"
            name="sample-name"
            testConnectionMockData={{
              data: testConnectionSuccess as any,
              loading: false
            }}
          />
        </TestWrapper>
      </MemoryRouter>
    )

    expect(container).toMatchSnapshot()
  }),
    test('render VerifyOutOfClusterDelegate for K8s and last step', () => {
      const { container } = render(
        <MemoryRouter>
          <TestWrapper>
            <VerifyOutOfClusterDelegate
              type="K8sCluster"
              name="sample-name"
              renderInModal={true}
              isLastStep
              testConnectionMockData={{
                data: testConnectionSuccess as any,
                loading: false
              }}
            />
          </TestWrapper>
        </MemoryRouter>
      )

      expect(container).toMatchSnapshot()
    }),
    test('render VerifyOutOfClusterDelegate for Docker', () => {
      const { container } = render(
        <MemoryRouter>
          <TestWrapper>
            <VerifyOutOfClusterDelegate
              type="DockerRegistry"
              name="sample-name"
              renderInModal={true}
              testConnectionMockData={{
                data: testConnectionSuccess as any,
                loading: false
              }}
            />
          </TestWrapper>
        </MemoryRouter>
      )

      expect(container).toMatchSnapshot()
    }),
    test('render VerifyOutOfClusterDelegate for Nexus', () => {
      const { container } = render(
        <MemoryRouter>
          <TestWrapper>
            <VerifyOutOfClusterDelegate
              type="Nexus"
              name="sample-name"
              renderInModal={true}
              testConnectionMockData={{
                data: testConnectionSuccess as any,
                loading: false
              }}
            />
          </TestWrapper>
        </MemoryRouter>
      )

      expect(container).toMatchSnapshot()
    }),
    test('render VerifyOutOfClusterDelegate for Nexus', () => {
      const { container } = render(
        <MemoryRouter>
          <TestWrapper>
            <VerifyOutOfClusterDelegate
              type="Splunk"
              name="sample-name"
              renderInModal={true}
              testConnectionMockData={{
                data: testConnectionSuccess as any,
                loading: false
              }}
            />
          </TestWrapper>
        </MemoryRouter>
      )

      expect(container).toMatchSnapshot()
    }),
    test('render VerifyOutOfClusterDelegate for AppDynamics', () => {
      const { container } = render(
        <MemoryRouter>
          <TestWrapper>
            <VerifyOutOfClusterDelegate
              type="AppDynamics"
              name="sample-name"
              renderInModal={true}
              testConnectionMockData={{
                data: testConnectionSuccess as any,
                loading: false
              }}
            />
          </TestWrapper>
        </MemoryRouter>
      )

      expect(container).toMatchSnapshot()
    }),
    test('render VerifyOutOfClusterDelegate for Artifactory', () => {
      const { container } = render(
        <MemoryRouter>
          <TestWrapper>
            <VerifyOutOfClusterDelegate
              type="Artifactory"
              name="sample-name"
              renderInModal={true}
              testConnectionMockData={{
                data: testConnectionSuccess as any,
                loading: false
              }}
            />
          </TestWrapper>
        </MemoryRouter>
      )

      expect(container).toMatchSnapshot()
    })
})
