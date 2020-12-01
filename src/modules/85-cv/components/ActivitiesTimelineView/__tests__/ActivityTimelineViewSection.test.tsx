import React from 'react'
import { render, waitFor } from '@testing-library/react'
import * as restfulReact from 'restful-react'
import { TestWrapper, TestWrapperProps } from '@common/utils/testUtils'
import { accountPathProps, projectPathProps } from '@common/utils/routeUtils'
import routes from '@common/RouteDefinitions'
import ActivityTimelineViewSection from '../ActivitiesTimelineViewSection'
import i18n from '../ActivitiesTimelineView.i18n'

const mockRefetch = jest.fn()
const testWrapperProps: TestWrapperProps = {
  path: routes.toCVActivityChangesPage({ ...accountPathProps, ...projectPathProps }),
  pathParams: {
    accountId: '1234_accountId',
    projectIdentifier: '1234_project',
    orgIdentifier: '1234_ORG'
  }
}

describe('Unit tests for ActivityTimelineViewSection', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockRefetch.mockClear()
  })

  test('Ensure that error card is rendered when error is returned', async () => {
    const useGetSpy = jest.spyOn(restfulReact, 'useGet')
    useGetSpy.mockImplementation(() => {
      return { error: { message: 'mock error' }, refetch: mockRefetch as unknown } as restfulReact.UseGetReturn<
        unknown,
        unknown,
        unknown,
        unknown
      >
    })

    const { container, getByText } = render(
      <TestWrapper {...testWrapperProps}>
        <ActivityTimelineViewSection startTime={0} endTime={0} />
      </TestWrapper>
    )
    await waitFor(() => expect(container.querySelector('[class*="main"]')).not.toBeNull())

    expect(container.querySelector('[class*="errorAndNoData"]')).not.toBeNull()
    expect(getByText('mock error')).not.toBeNull()
    const retryButton = getByText(i18n.retry)
    expect(retryButton).not.toBeNull()

    retryButton.click()
    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalledTimes(1)
    })
  })

  test('Ensure that no data card is rendered when error is returned', async () => {
    const useGetSpy = jest.spyOn(restfulReact, 'useGet')
    useGetSpy.mockImplementation(() => {
      return { data: { resource: [] }, refetch: mockRefetch as unknown } as restfulReact.UseGetReturn<
        unknown,
        unknown,
        unknown,
        unknown
      >
    })
    const { getByText } = render(
      <TestWrapper {...testWrapperProps}>
        <ActivityTimelineViewSection startTime={-1} endTime={-1} />
      </TestWrapper>
    )
    await waitFor(() => expect(getByText(i18n.noDataText)).not.toBeNull())
  })

  test('Ensure that when error card is rendered when error is returned', async () => {
    const useGetSpy = jest.spyOn(restfulReact, 'useGet')
    useGetSpy.mockImplementation(() => {
      return { data: { resource: [] }, refetch: mockRefetch as unknown } as restfulReact.UseGetReturn<
        unknown,
        unknown,
        unknown,
        unknown
      >
    })
    const { getByText } = render(
      <TestWrapper {...testWrapperProps}>
        <ActivityTimelineViewSection startTime={-1} endTime={-1} />
      </TestWrapper>
    )
    await waitFor(() => expect(getByText(i18n.noDataText)).not.toBeNull())
  })
})
