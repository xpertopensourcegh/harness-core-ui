import React from 'react'
import { render, waitFor } from '@testing-library/react'
import type { UseGetReturn } from 'restful-react'
import { MetricPackCategoryLabels } from '@cv/pages/services/CVServicePageUtils'
import * as cvService from 'services/cv'
import * as framework from 'framework/route/RouteMounter'
import LogAnalysisFrequencyChart from '../LogAnalysisFrequencyChart'

const MockData = {
  metaData: {},
  resource: [
    {
      timestamp: 1606656600000,
      countByTags: [
        { tag: 'KNOWN', count: 378 },
        { tag: 'UNEXPECTED', count: 27 }
      ]
    },
    {
      timestamp: 1606656900000,
      countByTags: [
        { tag: 'KNOWN', count: 420 },
        { tag: 'UNEXPECTED', count: 30 }
      ]
    },
    {
      timestamp: 1606657200000,
      countByTags: [
        { tag: 'KNOWN', count: 420 },
        { tag: 'UNEXPECTED', count: 30 }
      ]
    },
    {
      timestamp: 1606657500000,
      countByTags: [
        { tag: 'KNOWN', count: 378 },
        { tag: 'UNEXPECTED', count: 27 }
      ]
    },
    {
      timestamp: 1606657800000,
      countByTags: [
        { tag: 'KNOWN', count: 378 },
        { tag: 'UNEXPECTED', count: 27 }
      ]
    },
    {
      timestamp: 1606658100000,
      countByTags: [
        { tag: 'KNOWN', count: 462 },
        { tag: 'UNEXPECTED', count: 33 }
      ]
    },
    {
      timestamp: 1606658400000,
      countByTags: [
        { tag: 'KNOWN', count: 378 },
        { tag: 'UNEXPECTED', count: 27 }
      ]
    },
    {
      timestamp: 1606658700000,
      countByTags: [
        { tag: 'KNOWN', count: 336 },
        { tag: 'UNEXPECTED', count: 24 }
      ]
    },
    {
      timestamp: 1606659000000,
      countByTags: [
        { tag: 'KNOWN', count: 336 },
        { tag: 'UNEXPECTED', count: 24 }
      ]
    },
    {
      timestamp: 1606659300000,
      countByTags: [
        { tag: 'KNOWN', count: 210 },
        { tag: 'UNEXPECTED', count: 15 }
      ]
    },
    {
      timestamp: 1606659600000,
      countByTags: [
        { tag: 'KNOWN', count: 420 },
        { tag: 'UNEXPECTED', count: 30 }
      ]
    },
    {
      timestamp: 1606659900000,
      countByTags: [
        { tag: 'KNOWN', count: 336 },
        { tag: 'UNEXPECTED', count: 24 }
      ]
    },
    {
      timestamp: 1606660200000,
      countByTags: [
        { tag: 'KNOWN', count: 462 },
        { tag: 'UNEXPECTED', count: 33 }
      ]
    },
    {
      timestamp: 1606660500000,
      countByTags: [
        { tag: 'KNOWN', count: 378 },
        { tag: 'UNEXPECTED', count: 27 }
      ]
    },
    {
      timestamp: 1606660800000,
      countByTags: [
        { tag: 'KNOWN', count: 420 },
        { tag: 'UNEXPECTED', count: 30 }
      ]
    },
    {
      timestamp: 1606661100000,
      countByTags: [
        { tag: 'KNOWN', count: 435 },
        { tag: 'UNEXPECTED', count: 15 }
      ]
    },
    {
      timestamp: 1606661400000,
      countByTags: [
        { tag: 'KNOWN', count: 393 },
        { tag: 'UNEXPECTED', count: 12 }
      ]
    },
    {
      timestamp: 1606661700000,
      countByTags: [
        { tag: 'KNOWN', count: 435 },
        { tag: 'UNEXPECTED', count: 15 }
      ]
    },
    {
      timestamp: 1606662000000,
      countByTags: [
        { tag: 'KNOWN', count: 378 },
        { tag: 'UNEXPECTED', count: 27 }
      ]
    },
    {
      timestamp: 1606662300000,
      countByTags: [
        { tag: 'KNOWN', count: 378 },
        { tag: 'UNEXPECTED', count: 27 }
      ]
    },
    {
      timestamp: 1606662600000,
      countByTags: [
        { tag: 'KNOWN', count: 462 },
        { tag: 'UNEXPECTED', count: 33 }
      ]
    },
    {
      timestamp: 1606662900000,
      countByTags: [
        { tag: 'KNOWN', count: 504 },
        { tag: 'UNEXPECTED', count: 36 }
      ]
    },
    {
      timestamp: 1606663200000,
      countByTags: [
        { tag: 'KNOWN', count: 504 },
        { tag: 'UNEXPECTED', count: 36 }
      ]
    },
    {
      timestamp: 1606663500000,
      countByTags: [
        { tag: 'KNOWN', count: 420 },
        { tag: 'UNEXPECTED', count: 30 }
      ]
    },
    {
      timestamp: 1606663800000,
      countByTags: [
        { tag: 'KNOWN', count: 336 },
        { tag: 'UNEXPECTED', count: 24 }
      ]
    },
    {
      timestamp: 1606664100000,
      countByTags: [
        { tag: 'KNOWN', count: 336 },
        { tag: 'UNEXPECTED', count: 24 }
      ]
    },
    {
      timestamp: 1606664400000,
      countByTags: [
        { tag: 'KNOWN', count: 420 },
        { tag: 'UNEXPECTED', count: 30 }
      ]
    },
    {
      timestamp: 1606664700000,
      countByTags: [
        { tag: 'KNOWN', count: 420 },
        { tag: 'UNEXPECTED', count: 30 }
      ]
    },
    {
      timestamp: 1606665000000,
      countByTags: [
        { tag: 'KNOWN', count: 378 },
        { tag: 'UNEXPECTED', count: 27 }
      ]
    },
    {
      timestamp: 1606665300000,
      countByTags: [
        { tag: 'KNOWN', count: 420 },
        { tag: 'UNEXPECTED', count: 30 }
      ]
    },
    {
      timestamp: 1606665600000,
      countByTags: [
        { tag: 'KNOWN', count: 390 },
        { tag: 'UNEXPECTED', count: 15 }
      ]
    },
    {
      timestamp: 1606665900000,
      countByTags: [
        { tag: 'KNOWN', count: 630 },
        { tag: 'UNEXPECTED', count: 45 }
      ]
    },
    {
      timestamp: 1606666200000,
      countByTags: [
        { tag: 'KNOWN', count: 672 },
        { tag: 'UNEXPECTED', count: 48 }
      ]
    },
    {
      timestamp: 1606666500000,
      countByTags: [
        { tag: 'KNOWN', count: 630 },
        { tag: 'UNEXPECTED', count: 45 }
      ]
    },
    {
      timestamp: 1606666800000,
      countByTags: [
        { tag: 'KNOWN', count: 462 },
        { tag: 'UNEXPECTED', count: 33 }
      ]
    },
    {
      timestamp: 1606667100000,
      countByTags: [
        { tag: 'KNOWN', count: 264 },
        { tag: 'UNEXPECTED', count: 6 }
      ]
    },
    {
      timestamp: 1606667400000,
      countByTags: [
        { tag: 'KNOWN', count: 504 },
        { tag: 'UNEXPECTED', count: 36 }
      ]
    },
    {
      timestamp: 1606667700000,
      countByTags: [
        { tag: 'KNOWN', count: 390 },
        { tag: 'UNEXPECTED', count: 15 }
      ]
    },
    {
      timestamp: 1606668000000,
      countByTags: [
        { tag: 'KNOWN', count: 462 },
        { tag: 'UNEXPECTED', count: 33 }
      ]
    },
    { timestamp: 1606668300000, countByTags: [{ tag: 'KNOWN', count: 165 }] },
    {
      timestamp: 1606668600000,
      countByTags: [
        { tag: 'KNOWN', count: 348 },
        { tag: 'UNEXPECTED', count: 12 }
      ]
    },
    {
      timestamp: 1606668900000,
      countByTags: [
        { tag: 'KNOWN', count: 477 },
        { tag: 'UNEXPECTED', count: 18 }
      ]
    },
    {
      timestamp: 1606669200000,
      countByTags: [
        { tag: 'KNOWN', count: 393 },
        { tag: 'UNEXPECTED', count: 12 }
      ]
    },
    {
      timestamp: 1606669500000,
      countByTags: [
        { tag: 'KNOWN', count: 435 },
        { tag: 'UNEXPECTED', count: 15 }
      ]
    },
    {
      timestamp: 1606669800000,
      countByTags: [
        { tag: 'KNOWN', count: 348 },
        { tag: 'UNEXPECTED', count: 12 }
      ]
    },
    { timestamp: 1606670100000, countByTags: [{ tag: 'KNOWN', count: 135 }] },
    {
      timestamp: 1606670400000,
      countByTags: [
        { tag: 'KNOWN', count: 435 },
        { tag: 'UNEXPECTED', count: 15 }
      ]
    },
    {
      timestamp: 1606670700000,
      countByTags: [
        { tag: 'KNOWN', count: 480 },
        { tag: 'UNEXPECTED', count: 15 }
      ]
    },
    {
      timestamp: 1606671000000,
      countByTags: [
        { tag: 'KNOWN', count: 390 },
        { tag: 'UNEXPECTED', count: 15 }
      ]
    },
    {
      timestamp: 1606671300000,
      countByTags: [
        { tag: 'KNOWN', count: 390 },
        { tag: 'UNEXPECTED', count: 15 }
      ]
    },
    { timestamp: 1606671600000, countByTags: [{ tag: 'KNOWN', count: 450 }] },
    {
      timestamp: 1606671900000,
      countByTags: [
        { tag: 'KNOWN', count: 390 },
        { tag: 'UNEXPECTED', count: 15 }
      ]
    },
    {
      timestamp: 1606672200000,
      countByTags: [
        { tag: 'KNOWN', count: 1020 },
        { tag: 'UNEXPECTED', count: 30 }
      ]
    },
    {
      timestamp: 1606672500000,
      countByTags: [
        { tag: 'KNOWN', count: 544 },
        { tag: 'UNEXPECTED', count: 16 }
      ]
    },
    {
      timestamp: 1606672800000,
      countByTags: [
        { tag: 'KNOWN', count: 680 },
        { tag: 'UNEXPECTED', count: 20 }
      ]
    },
    {
      timestamp: 1606673100000,
      countByTags: [
        { tag: 'KNOWN', count: 280 },
        { tag: 'UNEXPECTED', count: 20 }
      ]
    }
  ],
  responseMessages: []
}

describe('LogAnalysisFrequencyChart unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    const mockRouteParams = jest.spyOn(framework, 'useRouteParams')
    mockRouteParams.mockReturnValue({
      params: {
        accountId: '1234_accountId',
        projectIdentifier: '1234_project',
        orgIdentifier: '1234_ORG'
      },
      query: {}
    })
  })
  test('Ensure that when api returns data it is rendered', async () => {
    const useGetCountSpy = jest.spyOn(cvService, 'useGetTagCount')
    const refetchMock = jest.fn()
    useGetCountSpy.mockReturnValue({ data: MockData, refetch: refetchMock as unknown } as UseGetReturn<
      any,
      unknown,
      any,
      unknown
    >)

    const { container } = render(
      <LogAnalysisFrequencyChart
        startTime={1606656600000}
        endTime={1606676400000}
        categoryName={MetricPackCategoryLabels.PERFORMANCE}
      />
    )

    await waitFor(() => expect(container.querySelector('[class*="main"]')).not.toBeNull())
    expect(refetchMock).toHaveBeenCalledTimes(1)
    expect(refetchMock).toHaveBeenCalledWith({
      queryParams: {
        accountId: '1234_accountId',
        endTime: 1606676400000,
        environmentIdentifier: undefined,
        monitoringCategory: 'PERFORMANCE',
        orgIdentifier: '1234_ORG',
        projectIdentifier: '1234_project',
        serviceIdentifier: undefined,
        startTime: 1606656600000
      }
    })

    const bars = container.querySelectorAll('.highcharts-series rect')
    expect(bars.length).toBe(134)
    let totalBarsWithData = 0
    for (const bar of bars) {
      if (Number(bar.getAttribute('height')) > 0) {
        totalBarsWithData++
      }
    }
    expect(totalBarsWithData).toBe(109)
    expect(container.querySelectorAll('.highcharts-series rect[height="0"]').length).toBe(25)
  })
})
