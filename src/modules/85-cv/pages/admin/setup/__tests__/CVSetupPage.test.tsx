import React from 'react'
import { render, waitFor, queryByText, fireEvent } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { TestWrapper } from '@common/utils/testUtils'

import CVSetupPage from '../CVSetupPage'
import { onboardingData, withActivitySource } from './mockData/setupStatusData'

jest.mock('@cv/hooks/IndexedDBHook/IndexedDBHook', () => ({
  useIndexedDBHook: jest.fn().mockImplementation(() => {
    return { isInitializingDB: false, dbInstance: { get: jest.fn() } }
  }),
  CVObjectStoreNames: {}
}))

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
  test('check next and previous', async () => {
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
    expect(container).toMatchSnapshot()
    act(() => {
      const nextBtn = getByText('Next')
      fireEvent.click(nextBtn)
    })
    expect(getByText('MONITORING SOURCE')).toBeDefined()
    expect(getByText('Select your Monitoring Source')).toBeDefined()
    expect(container).toMatchSnapshot()

    act(() => {
      const prevBtn = getByText('Previous')
      fireEvent.click(prevBtn)
    })
    expect(getByText('Let’s get you started')).toBeDefined()
    expect(container).toMatchSnapshot()
  })
})
