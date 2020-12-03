import React from 'react'
import { Container } from '@wings-software/uikit'
import { waitFor, render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import routes from '@common/RouteDefinitions'
import { ActivitySourceSetupRoutePaths } from '@cv/utils/routeUtils'
import { accountPathProps, projectPathProps } from '@common/utils/routeUtils'
import ActivitySourceSetup from '../ActivitySourceSetup'

jest.mock('../kubernetes/KubernetesActivitySource', () => ({
  KubernetesActivitySource: function S() {
    return <Container className="kubeActivitySource" />
  }
}))

const TEST_PATH = routes.toCVActivitySourceSetup({
  ...accountPathProps,
  ...projectPathProps,
  activitySource: ':activitySource'
})

const pathParams = {
  accountId: 'loading',
  projectIdentifier: '1234_project',
  orgIdentifier: '1234_ORG'
}

describe('Unit tests for activity source setup', () => {
  test('Ensure kube component is rendered when activity source is kube', async () => {
    const { container } = render(
      <TestWrapper
        path={TEST_PATH}
        pathParams={{ ...pathParams, activitySource: ActivitySourceSetupRoutePaths.KUBERNETES }}
      >
        <ActivitySourceSetup />
      </TestWrapper>
    )
    await waitFor(() => expect(container.querySelector('[class*="kubeActivitySource"]')).not.toBeNull())
  })

  test('Ensure no component is rendered when activity source is empty', async () => {
    const { container } = render(
      <TestWrapper path={TEST_PATH} pathParams={{ ...pathParams, activitySource: ':activitySource' }}>
        <ActivitySourceSetup />
      </TestWrapper>
    )
    await waitFor(() => expect(container.querySelector('[class*="kubeActivitySource"]')).toBeNull())
    expect(container.children.length).toBe(1)
  })
})
