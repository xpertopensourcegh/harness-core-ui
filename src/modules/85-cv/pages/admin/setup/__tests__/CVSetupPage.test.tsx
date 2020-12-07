import React from 'react'
import { render, waitFor, queryByText } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import CVSetupPage from '../CVSetupPage'
import { onboardingData, withActivitySource } from './mockData/setupStatusData'

// jest.mock('react-timeago', () => () => 'dummy date')

describe('CVSetupPage', () => {
  test('render initial state', async () => {
    const { container, getByText } = render(
      <TestWrapper
        path="/cv/account/:accountId/org/:orgIdentifier/project/:projectIdentifier/admin/setup"
        pathParams={{ accountId: 'dummy', orgIdentifier: 'dummyOrgId', projectIdentifier: 'dummyProjectId' }}
      >
        <CVSetupPage
          setupStatusMockData={{
            data: onboardingData as any,
            loading: false
          }}
        />
      </TestWrapper>
    )
    await waitFor(() => queryByText(container, 'Setup'))
    expect(getByText('ACTIVITY SOURCE')).toBeDefined()
    expect(getByText('Let’s get you started')).toBeDefined()
    expect(container).toMatchSnapshot()
  })
  test('render when Activity source is already configured', async () => {
    const { container, getByText } = render(
      <TestWrapper
        path="/cv/account/:accountId/org/:orgIdentifier/project/:projectIdentifier/admin/setup"
        pathParams={{ accountId: 'dummy', orgIdentifier: 'dummyOrgId', projectIdentifier: 'dummyProjectId' }}
        queryParams={{ step: '2' }}
      >
        <CVSetupPage
          setupStatusMockData={{
            data: withActivitySource as any,
            loading: false
          }}
        />
      </TestWrapper>
    )
    await waitFor(() => queryByText(container, 'Setup'))
    expect(getByText('MONITORING SOURCE')).toBeDefined()
    expect(getByText('Select your Monitoring Source')).toBeDefined()
    expect(container).toMatchSnapshot()
  })
})
