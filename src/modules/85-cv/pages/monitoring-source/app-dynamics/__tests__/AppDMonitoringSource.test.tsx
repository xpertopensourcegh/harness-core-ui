import React from 'react'
import { render, waitFor, queryByText } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import * as framework from 'framework/route/RouteMounter'
import AppDMonitoringSOurce from '../AppDMonitoringSource'

describe('AppDMonitoringSOurce', () => {
  test('render initial state', async () => {
    const mockRouteParams = jest.spyOn(framework, 'useRouteParams')
    mockRouteParams.mockReturnValue({
      params: {
        accountId: 'loading',
        projectIdentifier: '1234_project',
        orgIdentifier: '1234_ORG'
      },
      query: {}
    })
    const { container, getByText } = render(
      <TestWrapper
        pathParams={{ accountId: 'dummy', orgIdentifier: 'dummyOrgId', projectIdentifier: 'dummyProjectId' }}
      >
        <AppDMonitoringSOurce />
      </TestWrapper>
    )
    await waitFor(() => queryByText(container, 'Select Product'))

    expect(getByText('Select Application')).toBeDefined()
    expect(container).toMatchSnapshot()
  })
})
