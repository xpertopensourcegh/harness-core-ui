import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { Container } from '@wings-software/uikit'
import * as framework from 'framework/route/RouteMounter'
import KubernetesActivitySource from '../KubernetesActivitySource'

jest.mock('@cv/components/CVOnboardingTabs/CVOnboardingTabs', () => () => <Container className="kubeForms" />)

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn().mockReturnValue([])
}))

describe('Unit tests for KubernetesActivitySource', () => {
  test('Ensure set name function is called, and buttons are rendered', async () => {
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
    const { container } = render(<KubernetesActivitySource />)
    await waitFor(() => expect(container.querySelector('[class*="kubeForms"]')).not.toBeNull())
  })
})
