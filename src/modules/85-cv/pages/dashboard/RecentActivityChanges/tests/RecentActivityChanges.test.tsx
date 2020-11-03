import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { Classes } from '@blueprintjs/core'
import { cloneDeep } from 'lodash-es'
import { MetricCategoryNames } from '@cv/components/MetricCategoriesWithRiskScore/MetricCategoriesWithRiskScore'
import * as framework from 'framework/route/RouteMounter'
import { routeCVDataSources } from 'navigation/cv/routes'
import RecentActivityChanges from '../RecentActivityChanges'
import i18n from '../RecentActivityChanges.i18n'

const MockData = [
  {
    activityType: 'DEPLOYMENT',
    activityName: 'Configuration Change',
    serviceIdentifier: 'Manager',
    preActivityRisks: [
      {
        category: MetricCategoryNames.RESOURCES,
        risk: 55
      },
      {
        category: MetricCategoryNames.ERRORS,
        risk: 25
      },
      {
        category: MetricCategoryNames.PERFORMANCE,
        risk: 30
      }
    ],
    progressPercentage: 43,
    activityStartTime: new Date().getTime(),
    status: 'IN_PROGRESS',
    overallRisk: 52,
    remainingTimeMs: 10,
    postActivityRisks: [
      {
        category: MetricCategoryNames.RESOURCES,
        risk: 55
      },
      {
        category: MetricCategoryNames.ERRORS,
        risk: 25
      },
      {
        category: MetricCategoryNames.PERFORMANCE,
        risk: 15
      }
    ]
  }
]
const refetchFunc = jest.fn()
jest.mock('services/cv', () => ({
  ...(jest.requireActual('services/cv') as object),
  useGetRecentActivityVerificationResults: jest.fn().mockImplementation(({ queryParams }) => {
    const { accountId } = queryParams
    if (accountId === 'loading') {
      return { loading: true }
    } else if (accountId === 'error') {
      return { error: { message: 'mocked error' }, refetch: refetchFunc }
    } else if (accountId === 'no data') {
      return { data: { resources: [] } }
    } else if (accountId === 'initiated') {
      const mockDataWithInitiatedState = cloneDeep(MockData)
      mockDataWithInitiatedState[0].progressPercentage = 0
      mockDataWithInitiatedState[0].status = 'NOT_STARTED'
      mockDataWithInitiatedState[0].overallRisk = undefined as any
      return {
        data: {
          resource: mockDataWithInitiatedState
        }
      }
    } else if (accountId === 'failed') {
      const mockDataWithInitiatedState = cloneDeep(MockData)
      mockDataWithInitiatedState[0].progressPercentage = 45
      mockDataWithInitiatedState[0].status = 'ERROR'
      mockDataWithInitiatedState[0].overallRisk = 90
      return {
        data: {
          resource: mockDataWithInitiatedState
        }
      }
    } else if (accountId === 'no percentage') {
      const mockDataWithInitiatedState = cloneDeep(MockData)
      mockDataWithInitiatedState[0].progressPercentage = undefined as any
      mockDataWithInitiatedState[0].status = 'ERROR'
      mockDataWithInitiatedState[0].overallRisk = 90
      return {
        data: {
          resource: mockDataWithInitiatedState
        }
      }
    }

    return {
      data: {
        resource: MockData
      }
    }
  })
}))

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn().mockReturnValue([])
}))

describe('Unit tests for RecentActivityChanges', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  test('Ensure that loading state is rendered when api is loading', async () => {
    const mockRouteParams = jest.spyOn(framework, 'useRouteParams')
    mockRouteParams.mockReturnValue({
      params: {
        accountId: 'loading',
        projectIdentifier: '1234_project',
        orgIdentifier: '1234_ORG'
      },
      query: {}
    })

    const { container } = render(<RecentActivityChanges />)
    await waitFor(() => expect(container.querySelectorAll(`[class*="${Classes.SKELETON}"]`).length).toBe(3))
  })

  test('Ensure that when no data is returned, the no data card is displayed', async () => {
    const mockRouteParams = jest.spyOn(framework, 'useRouteParams')
    mockRouteParams.mockReturnValue({
      params: {
        accountId: 'no data',
        projectIdentifier: '1234_project',
        orgIdentifier: '1234_ORG'
      },
      query: {}
    })

    const routeSpy = jest.spyOn(routeCVDataSources, 'url')

    const { container, getByText } = render(<RecentActivityChanges />)
    await waitFor(() => expect(container.querySelector('[class*="activityList"]')).not.toBeNull())
    expect(getByText(i18n.noActivitiesMessaging)).not.toBeNull()
    const goToDataSourcesButton = getByText(i18n.noActivitiesButtonText)
    expect(goToDataSourcesButton).not.toBeNull()
    goToDataSourcesButton.click()
    await waitFor(() => expect(routeSpy).toHaveBeenCalled())
  })

  test('Ensure that when an error happens, error card is displayed', async () => {
    const mockRouteParams = jest.spyOn(framework, 'useRouteParams')
    mockRouteParams.mockReturnValue({
      params: {
        accountId: 'error',
        projectIdentifier: '1234_project',
        orgIdentifier: '1234_ORG'
      },
      query: {}
    })
    const { container, getByText } = render(<RecentActivityChanges />)
    await waitFor(() => expect(container.querySelector('[class*="activityList"]')).not.toBeNull())
    const retryButton = getByText(i18n.retryText)
    expect(retryButton).not.toBeNull()
    retryButton.click()
    await waitFor(() => expect(refetchFunc).toHaveBeenCalledTimes(1))
  })

  test('Ensure that data is rendered when api provides data', async () => {
    const mockRouteParams = jest.spyOn(framework, 'useRouteParams')
    mockRouteParams.mockReturnValue({
      params: {
        accountId: '1234_accountId',
        projectIdentifier: '1234_project',
        orgIdentifier: '1234_ORG'
      },
      query: {}
    })

    const { container } = render(<RecentActivityChanges />)
    await waitFor(() => expect(container.querySelector('[class*="activityList"]')).not.toBeNull())

    const dataRows = container.querySelectorAll('[class*="dataRow"]')
    expect(dataRows.length).toBe(1)

    const dataColumns = container.querySelectorAll('[class*="dataColumn"]')
    expect(dataColumns.length).toBe(2)

    const riskScores = container.querySelectorAll('[class*="riskScore"]')
    expect(riskScores.length).toBe(6)
    expect(riskScores[0].innerHTML).toEqual('55')
    expect(riskScores[1].innerHTML).toEqual('25')
    expect(riskScores[2].innerHTML).toEqual('30')
    expect(riskScores[3].innerHTML).toEqual('55')
    expect(riskScores[4].innerHTML).toEqual('25')
    expect(riskScores[5].innerHTML).toEqual('15')
  })

  test('Ensure right status messaging is displayed on top of progress bar for in progress with time remaining', async () => {
    const mockRouteParams = jest.spyOn(framework, 'useRouteParams')
    mockRouteParams.mockReturnValue({
      params: {
        accountId: '1234_accountId',
        projectIdentifier: '1234_project',
        orgIdentifier: '1234_ORG'
      },
      query: {}
    })

    // in progress with time remaining
    const { container, getByText } = render(<RecentActivityChanges />)
    await waitFor(() => expect(container.querySelector('[class*="activityList"]')).not.toBeNull())
    expect(getByText(`${i18n.verificationProgressText.inProgress} (10 ${i18n.verificationProgressText.remainingTime})`))
    const progressMeter = container.querySelector(`[class*="${Classes.PROGRESS_METER}"]`)
    expect(progressMeter?.getAttribute('style')).toEqual('width: 43%;')
    expect(progressMeter?.getAttribute('class')).toContain('heatmapColor6')
  })

  test('Ensure right status messaging is displayed on top of progress bar for in progress with 0 progress', async () => {
    const mockRouteParams = jest.spyOn(framework, 'useRouteParams')
    mockRouteParams.mockReturnValue({
      params: {
        accountId: i18n.verificationProgressText.initiated,
        projectIdentifier: '1234_project',
        orgIdentifier: '1234_ORG'
      },
      query: {}
    })

    // initiated with no progress
    const { container, getByText } = render(<RecentActivityChanges />)
    await waitFor(() => expect(container.querySelector('[class*="activityList"]')).not.toBeNull())
    expect(getByText(`${i18n.verificationProgressText.initiated}`))
    const progressMeter = container.querySelector(`[class*="${Classes.PROGRESS_METER}"]`)
    expect(progressMeter?.getAttribute('style')).toEqual('width: 0%;')
    expect(progressMeter?.getAttribute('class')).toContain('heatmapColor1')
  })

  test('Ensure right status messaging is displayed on top of progress bar for verification that errored out', async () => {
    const mockRouteParams = jest.spyOn(framework, 'useRouteParams')
    mockRouteParams.mockReturnValue({
      params: {
        accountId: 'failed',
        projectIdentifier: '1234_project',
        orgIdentifier: '1234_ORG'
      },
      query: {}
    })

    // failed mid way
    const { container, getByText } = render(<RecentActivityChanges />)
    await waitFor(() => expect(container.querySelector('[class*="activityList"]')).not.toBeNull())
    expect(
      getByText(
        `${i18n.verificationProgressText.verification} ${i18n.verificationProgressText.failed} (${i18n.verificationProgressText.riskScore}: 90)`
      )
    )
    const progressMeter = container.querySelector(`[class*="${Classes.PROGRESS_METER}"]`)
    expect(progressMeter?.getAttribute('style')).toEqual('width: 45%;')
    expect(progressMeter?.getAttribute('class')).toContain('heatmapColor9')
  })

  test('Ensure right status messaging is displayed when there is no progress percentage', async () => {
    const mockRouteParams = jest.spyOn(framework, 'useRouteParams')
    mockRouteParams.mockReturnValue({
      params: {
        accountId: 'no percentage',
        projectIdentifier: '1234_project',
        orgIdentifier: '1234_ORG'
      },
      query: {}
    })

    const { container } = render(<RecentActivityChanges />)
    await waitFor(() => expect(container.querySelector('[class*="activityList"]')).not.toBeNull())
    const childNodes = container.querySelector('[class*="verificationProgress"]')?.children
    expect(childNodes?.length).toBe(3)
    expect(childNodes?.[0].innerHTML).toEqual('')
  })
})
