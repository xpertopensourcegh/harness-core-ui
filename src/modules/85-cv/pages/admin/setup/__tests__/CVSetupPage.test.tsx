import React from 'react'
import { render, waitFor, queryByText, fireEvent } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import type { UseGetReturn } from 'restful-react'
import { TestWrapper } from '@common/utils/testUtils'
import * as cvService from 'services/cv'
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
    jest.spyOn(cvService, 'useGetAvailableMonitoringSources').mockReturnValue({
      data: { resource: [] }
    } as UseGetReturn<any, any, any, any>)
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
    expect(getByText('cv.onboarding.activitySources.changeSourceInfo')).toBeDefined()
    expect(getByText('common.letsGetYouStarted')).toBeDefined()
    expect(container).toMatchSnapshot()
  })
  test('check next and previous', async () => {
    jest.spyOn(cvService, 'useGetAvailableMonitoringSources').mockReturnValue({
      data: { resource: [] }
    } as UseGetReturn<any, any, any, any>)
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
      const nextBtn = getByText('next')
      fireEvent.click(nextBtn)
    })
    expect(getByText('cv.onboarding.monitoringSources.monitoringSourceInfo')).toBeDefined()
    expect(getByText('cv.onboarding.monitoringSources.select')).toBeDefined()
    expect(container).toMatchSnapshot()

    act(() => {
      const prevBtn = getByText('previous')
      fireEvent.click(prevBtn)
    })
    expect(getByText('common.letsGetYouStarted')).toBeDefined()
    expect(container).toMatchSnapshot()
  })

  test('Ensure next and submit buttons are disabled if api returns no monitoring sources, otherwise is enabled', async () => {
    // ensur that, user cannot get to verification jobs
    jest.spyOn(cvService, 'useGetAvailableMonitoringSources').mockReturnValue({
      data: {}
    } as UseGetReturn<any, any, any, any>)
    const { container, getByText, rerender, getAllByText } = render(
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

    await waitFor(() =>
      expect(getByText('CV.NAVLINKS.ADMINSIDENAVLINKS.ACTIVITYSOURCES')?.getAttribute('class')).toContain(
        '--color-black'
      )
    )
    fireEvent.click(getByText('next'))
    await waitFor(() =>
      expect(getByText('cv.onboarding.monitoringSources.monitoringSourceInfo')?.getAttribute('class')).toContain(
        '--color-grey400'
      )
    )
    await waitFor(() =>
      expect(getByText('CV.NAVLINKS.ADMINSIDENAVLINKS.ACTIVITYSOURCES')?.getAttribute('class')).toContain(
        '--color-grey500'
      )
    )
    expect(container.querySelectorAll('button')[1].getAttribute('disabled')).toEqual('')

    jest.spyOn(cvService, 'useGetAvailableMonitoringSources').mockReturnValue({
      data: { resource: ['APP_DYNAMICS'] }
    } as UseGetReturn<any, any, any, any>)

    jest.spyOn(cvService, 'useGetDefaultHealthVerificationJob').mockReturnValue({
      data: {}
    } as UseGetReturn<any, any, any, any>)

    // rerender when api returns info
    rerender(
      <TestWrapper
        path="/cv/account/:accountId/org/:orgIdentifier/project/:projectIdentifier/admin/setup"
        pathParams={{ accountId: 'dummy', orgIdentifier: 'dummyOrgId', projectIdentifier: '1234_project' }}
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

    // ensure you are still on same step, this might not actually be desired, but will revisit later
    await waitFor(() =>
      expect(getAllByText('CV.NAVLINKS.ADMINSIDENAVLINKS.MONITORINGSOURCES')[0]?.getAttribute('class')).toContain(
        '--color-black'
      )
    )
    fireEvent.click(getByText('next'))
    expect(container)
    await waitFor(() => expect(getByText('VERIFICATIONJOBS')?.getAttribute('class')).toContain('--color-black'))
  })
})
