import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import type { UseGetReturn } from 'restful-react'
import { TestWrapper } from '@common/utils/testUtils'
import * as cvService from 'services/cv'
import * as framework from 'framework/route/RouteMounter'
import CVActivitySourcesPage from '../CVActivitySourcesPage'

describe('CVActivitySourcesPage unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    const mockRouteParams = jest.spyOn(framework, 'useRouteParams')
    mockRouteParams.mockReturnValue({
      params: {
        accountId: '1234_accountId',
        projectIdentifier: '1234_project',
        orgIdentifier: '1234_org'
      },
      query: {}
    })
  })

  test('Ensure when api returns data it is rendered correctly', async () => {
    const useListKubernetesSourcesSpy = jest.spyOn(cvService, 'useListKubernetesSources')
    useListKubernetesSourcesSpy.mockReturnValue({
      data: {
        resource: [
          {
            uuid: '1234_uuid',
            name: 'kube_activitySource',
            activitySourceConfigs: [
              {
                serviceIdentifier: '1234_ser',
                envIdentifier: '1234_env'
              },
              {
                serviceIdentifier: '5678_ser',
                envIdentifier: '1234_env'
              },
              {
                serviceIdentifier: '91011_ser',
                envIdentifier: '5678_env'
              }
            ]
          },
          {
            uuid: '5678_uuid',
            name: 'cd_1.0_source',
            activitySourceConfigs: [
              {
                envIdentifier: '1234_env',
                serviceIdentifier: '5678_ser'
              }
            ]
          }
        ]
      },
      refetch: jest.fn() as unknown
    } as UseGetReturn<any, unknown, any, unknown>)

    const { container } = render(
      <TestWrapper>
        <CVActivitySourcesPage />
      </TestWrapper>
    )

    await waitFor(() => expect(container.querySelector('[class*="main"]')).not.toBeNull())
    const tableRows = container.querySelectorAll('[role="row"]')
    expect(tableRows.length).toBe(3)
    expect(container).toMatchSnapshot()

    fireEvent.click(tableRows[1])
  })

  test('Ensure refetch is called on click of retry for api error', async () => {
    const useListKubernetesSourcesSpy = jest.spyOn(cvService, 'useListKubernetesSources')
    const refetchMock = jest.fn() as unknown
    useListKubernetesSourcesSpy.mockReturnValue({
      error: { message: 'mock error' },
      refetch: refetchMock
    } as UseGetReturn<any, unknown, any, unknown>)

    const { container, getByText } = render(
      <TestWrapper>
        <CVActivitySourcesPage />
      </TestWrapper>
    )

    await waitFor(() => expect(getByText('mock error')).not.toBeNull())
    const retryButton = container.querySelector('button')
    if (!retryButton) {
      throw new Error('Retry button is missing.')
    }

    fireEvent.click(retryButton)
    await waitFor(() => expect(refetchMock).toHaveBeenCalledTimes(1))
  })

  test('Ensure that no data card is displayed when api returns no data', async () => {
    const useListKubernetesSourcesSpy = jest.spyOn(cvService, 'useListKubernetesSources')
    useListKubernetesSourcesSpy.mockReturnValue({
      data: { resource: [] }
    } as UseGetReturn<any, unknown, any, unknown>)

    const { getByText } = render(
      <TestWrapper>
        <CVActivitySourcesPage />
      </TestWrapper>
    )

    await waitFor(() => expect(getByText('No Activity Sources onboarded')).not.toBeNull())
    const retryButton = getByText('Onboard Activity Source(s)')
    if (!retryButton) {
      throw new Error('Retry button is missing.')
    }

    fireEvent.click(retryButton)
  })
})
