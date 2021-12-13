import React from 'react'
import userEvent from '@testing-library/user-event'
import { render, waitFor, screen } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import * as cvServices from 'services/cv'
import CVSLOsListingPage from '../CVSLOsListingPage'
import type { CVSLOsListingPageProps } from '../CVSLOsListingPage.types'
import { PAGE_SIZE_DASHBOARD_WIDGETS } from '../CVSLOsListingPage.constants'
import {
  testWrapperProps,
  pathParams,
  errorMessage,
  dashboardWidgetsResponse,
  userJourneyResponse
} from './CVSLOsListingPage.mock'

jest.mock('@cv/pages/slos/SLOCard/SLOCardHeader.tsx', () => ({
  __esModule: true,
  default: function SLOCardHeader() {
    return <span data-testid="slo-card-header" />
  }
}))

jest.mock('@cv/pages/slos/SLOCard/SLOCardContent.tsx', () => ({
  __esModule: true,
  default: function SLOCardContent() {
    return <span data-testid="slo-card-content" />
  }
}))

jest.mock('services/cv', () => ({
  useGetAllJourneys: jest.fn().mockImplementation(() => ({ refetch: jest.fn() })),
  useGetSLODashboardWidgets: jest.fn().mockImplementation(() => ({ refetch: jest.fn() })),
  useDeleteSLOData: jest.fn().mockImplementation(() => ({ mutate: jest.fn() }))
}))

const ComponentWrapper: React.FC<CVSLOsListingPageProps> = ({ monitoredServiceIdentifier }) => {
  return (
    <TestWrapper {...testWrapperProps}>
      <CVSLOsListingPage monitoredServiceIdentifier={monitoredServiceIdentifier} />
    </TestWrapper>
  )
}

describe('Test cases for CVSLOsListingPage component', () => {
  afterEach(() => jest.clearAllMocks())

  test('Without monitoredServiceIdentifier it should render with the page header and +New SLO button, and No data state', () => {
    render(<ComponentWrapper />)

    expect(screen.getByText('cv.slos.title')).toBeInTheDocument()
    expect(screen.getByText('cv.slos.newSLO')).toBeInTheDocument()
    expect(screen.getByText('cv.slos.noData')).toBeInTheDocument()
  })

  test('With monitoredServiceIdentifier it should not render with the page header and +New SLO button, and No data state', () => {
    render(<ComponentWrapper monitoredServiceIdentifier="monitored_service_identifier" />)

    expect(screen.queryByText('cv.slos.title')).not.toBeInTheDocument()
    expect(screen.queryByText('cv.slos.newSLO')).not.toBeInTheDocument()
    expect(screen.getByText('cv.slos.noData')).toBeInTheDocument()
  })

  test('Page loading state', () => {
    jest.spyOn(cvServices, 'useGetSLODashboardWidgets').mockReturnValue({ loading: true } as any)

    render(<ComponentWrapper />)

    expect(screen.getByText('Loading, please wait...')).toBeInTheDocument()
  })

  test('Page error state', () => {
    const onRetry = jest.fn()
    jest
      .spyOn(cvServices, 'useGetSLODashboardWidgets')
      .mockReturnValue({ error: { message: errorMessage }, refetch: onRetry } as any)

    render(<ComponentWrapper />)

    expect(screen.getByText(errorMessage)).toBeInTheDocument()

    userEvent.click(screen.getByText('Retry'))

    waitFor(() =>
      expect(onRetry).toBeCalledWith({
        ...pathParams,
        pageNumber: 0,
        pageSize: PAGE_SIZE_DASHBOARD_WIDGETS
      })
    )
  })

  test('Page data state', () => {
    jest
      .spyOn(cvServices, 'useGetSLODashboardWidgets')
      .mockReturnValue({ data: dashboardWidgetsResponse, refetch: jest.fn() } as any)

    jest
      .spyOn(cvServices, 'useGetAllJourneys')
      .mockReturnValue({ data: userJourneyResponse, refetch: jest.fn() } as any)

    render(<ComponentWrapper />)

    expect(screen.getByText('First Journey')).toBeInTheDocument()
    expect(screen.getByText('Second Journey')).toBeInTheDocument()
    expect(screen.getAllByTestId('slo-card-container')).toHaveLength(1)
    expect(screen.getAllByTestId('slo-card-header')).toHaveLength(1)
    expect(screen.getAllByTestId('slo-card-content')).toHaveLength(1)
  })

  // eslint-disable-next-line jest/no-disabled-tests
  test.skip('User journey filter select and deselect', () => {
    const refetchDashboardWidgets = jest.fn()
    jest
      .spyOn(cvServices, 'useGetSLODashboardWidgets')
      .mockReturnValue({ data: dashboardWidgetsResponse, refetch: refetchDashboardWidgets } as any)

    render(<ComponentWrapper />)

    userEvent.click(screen.getByText('First Journey'))

    waitFor(() =>
      expect(refetchDashboardWidgets).toBeCalledWith({
        ...pathParams,
        userJourneyIdentifiers: ['First_Journey'],
        pageNumber: 0,
        pageSize: PAGE_SIZE_DASHBOARD_WIDGETS
      })
    )

    userEvent.click(screen.getByText('Second Journey'))

    waitFor(() =>
      expect(refetchDashboardWidgets).toBeCalledWith({
        ...pathParams,
        userJourneyIdentifiers: ['Second_Journey'],
        pageNumber: 0,
        pageSize: PAGE_SIZE_DASHBOARD_WIDGETS
      })
    )

    userEvent.click(screen.getByText('Second Journey'))

    waitFor(() =>
      expect(refetchDashboardWidgets).toBeCalledWith({
        ...pathParams,
        pageNumber: 0,
        pageSize: PAGE_SIZE_DASHBOARD_WIDGETS
      })
    )
  })
})
