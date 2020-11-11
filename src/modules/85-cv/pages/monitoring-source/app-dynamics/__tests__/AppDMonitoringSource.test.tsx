import React from 'react'
import { render, waitFor, queryByText } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import AppDMonitoringSOurce from '../AppDMonitoringSource'

describe('AppDMonitoringSOurce', () => {
  test('render initial state', async () => {
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
