import React from 'react'
import { Container } from '@wings-software/uikit'
import { waitFor, render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import * as framework from 'framework/route/RouteMounter'
import { ActivitySourceSetupRoutePaths } from 'navigation/cv/routePaths'
import ActivitySourceSetup from '../ActivitySourceSetup'

jest.mock('../kubernetes/KubernetesActivitySource', () => () => <Container className="kubeActivitySource" />)

describe('Unit tests for activity source setup', () => {
  test('Ensure kube component is rendered when activity source is kube', async () => {
    const mockRouteParams = jest.spyOn(framework, 'useRouteParams')
    mockRouteParams.mockReturnValue({
      params: {
        accountId: 'loading',
        projectIdentifier: '1234_project',
        orgIdentifier: '1234_ORG',
        activitySource: ActivitySourceSetupRoutePaths.KUBERNETES
      },
      query: {}
    })

    const { container } = render(
      <TestWrapper>
        <ActivitySourceSetup />
      </TestWrapper>
    )
    await waitFor(() => expect(container.querySelector('[class*="kubeActivitySource"]')).not.toBeNull())
  })

  test('Ensure no component is rendered when activity source is empty', async () => {
    const mockRouteParams = jest.spyOn(framework, 'useRouteParams')
    mockRouteParams.mockReturnValue({
      params: {
        accountId: 'loading',
        projectIdentifier: '1234_project',
        orgIdentifier: '1234_ORG',
        activitySource: ''
      },
      query: {}
    })

    const { container } = render(
      <TestWrapper>
        <ActivitySourceSetup />
      </TestWrapper>
    )
    await waitFor(() => expect(container.querySelector('[class*="kubeActivitySource"]')).toBeNull())
    expect(container.children.length).toBe(1)
  })
})
