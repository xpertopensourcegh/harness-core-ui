import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import type { UseGetReturn } from 'restful-react'
import * as cvService from 'services/cv'
import { TestWrapper } from '@common/utils/testUtils'
import routes from '@common/RouteDefinitions'
import { accountPathProps, projectPathProps } from '@common/utils/routeUtils'
import ServiceSelector from '../ServiceSelector'

const pathParams = {
  accountId: 'loading',
  projectIdentifier: '1234_project',
  orgIdentifier: '1234_ORG'
}
const TEST_PATH = routes.toCVServices({ ...accountPathProps, ...projectPathProps })

describe('Unit tests for service selector', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  test('Ensure that when no data state is rendered when no data is provided', async () => {
    const useGetEnvServiceRiskSpy = jest.spyOn(cvService, 'useGetEnvServiceRisks')
    useGetEnvServiceRiskSpy.mockReturnValue({
      data: {
        resource: []
      },
      refetch: jest.fn() as unknown
    } as UseGetReturn<any, unknown, any, unknown>)

    const isEmptyListMock = jest.fn()
    const { container } = render(
      <TestWrapper path={TEST_PATH} pathParams={pathParams}>
        <ServiceSelector isEmptyList={isEmptyListMock} />
      </TestWrapper>
    )
    await waitFor(() => expect(container.querySelector('[class*="main"]')).not.toBeNull())
    const mainContainer = container.querySelector('[class*="main"]')
    expect(mainContainer?.children.length).toBe(1)
  })

  test('Ensure that environments and services are rendered when provided', async () => {
    const useGetEnvServiceRiskSpy = jest.spyOn(cvService, 'useGetEnvServiceRisks')
    useGetEnvServiceRiskSpy.mockReturnValue({
      data: {
        resource: [
          {
            orgIdentifier: 'harness_test',
            projectIdentifier: 'praveenproject',
            envIdentifier: 'Prod',
            envName: 'Production',
            risk: null,
            serviceRisks: [{ serviceIdentifier: 'manager', risk: -1, serviceName: 'Manager_2' }]
          }
        ]
      },
      refetch: jest.fn() as unknown
    } as UseGetReturn<any, unknown, any, unknown>)

    const onSelectMock = jest.fn()
    const { container } = render(
      <TestWrapper path={TEST_PATH} pathParams={pathParams}>
        <ServiceSelector onSelect={onSelectMock} />
      </TestWrapper>
    )
    await waitFor(() => expect(container.querySelector('[class*="main"]')).not.toBeNull())

    expect(container.querySelectorAll('[class*="entityRow"]').length).toBe(3)
    const environmentRow = container.querySelector('[class*="environmentRow"]')
    if (!environmentRow) {
      throw Error('Environment row was not rendered.')
    }

    expect(environmentRow.children[0]?.innerHTML).toEqual('Environment: Production')
    expect(environmentRow.children[1]?.getAttribute('class')).toContain('noRiskScore')

    const serviceRow = container.querySelector('[class*="serviceRow"]')
    if (!serviceRow) {
      throw Error('Service row was not rendered.')
    }

    expect(serviceRow.children[0]?.innerHTML).toEqual('Manager_2')
    expect(serviceRow.children[1]?.getAttribute('class')).toContain('noRiskScore')

    fireEvent.click(serviceRow)
    await waitFor(() => expect(onSelectMock).toHaveBeenCalledTimes(1))
    expect(onSelectMock).toHaveBeenLastCalledWith('Prod', 'manager')
    expect(serviceRow.getAttribute('data-selected')).toEqual('true')

    const allServices = container.querySelector('[class*="allServiceSelector"]')
    if (!allServices) {
      throw Error('All services option was not rendered.')
    }
    fireEvent.click(allServices)
    await waitFor(() => expect(allServices.getAttribute('data-selected')).toEqual('true'))

    expect(onSelectMock).toHaveBeenCalledWith(undefined, undefined)
  })

  test('Ensure only valid services and environments are rendered', async () => {
    const useGetEnvServiceRiskSpy = jest.spyOn(cvService, 'useGetEnvServiceRisks')
    useGetEnvServiceRiskSpy.mockReturnValue({
      data: {
        resource: [
          {
            orgIdentifier: 'harness_test',
            projectIdentifier: 'praveenproject',
            envIdentifier: 'Prod',
            envName: 'Production',
            risk: null,
            serviceRisks: [
              {
                serviceIdentifier: 'manager',
                risk: -1,
                serviceName: 'Manager_2'
              },
              { serviceIdentifier: null, risk: 5, serviceName: 'sdsf' },
              { serviceIdentifier: 'asddsd', risk: 5, serviceName: '' },
              {
                serviceIdentifier: 'semiAuto15',
                risk: -1,
                serviceName: 'solo-dolo'
              }
            ]
          },
          {
            orgIdentifier: 'harness_test',
            projectIdentifier: 'praveenproject',
            envIdentifier: 'sdfs',
            envName: '',
            risk: null,
            serviceRisks: [
              {
                serviceIdentifier: 'manager',
                risk: -1,
                serviceName: 'Manager_2'
              },
              { serviceIdentifier: null, risk: 5, serviceName: 'sdsf' },
              { serviceIdentifier: 'asddsd', risk: 5, serviceName: '' }
            ]
          },
          {
            orgIdentifier: 'harness_test',
            projectIdentifier: 'praveenproject',
            envName: 'sdfsfs',
            risk: null,
            serviceRisks: [
              {
                serviceIdentifier: 'manager',
                risk: -1,
                serviceName: 'Manager_2'
              },
              { serviceIdentifier: null, risk: 5, serviceName: 'sdsf' },
              { serviceIdentifier: 'asddsd', risk: 5, serviceName: '' }
            ]
          }
        ]
      },
      refetch: jest.fn() as unknown
    } as UseGetReturn<any, unknown, any, unknown>)

    const onSelectMock = jest.fn()
    const { container } = render(
      <TestWrapper path={TEST_PATH} pathParams={pathParams}>
        <ServiceSelector onSelect={onSelectMock} />
      </TestWrapper>
    )
    await waitFor(() => expect(container.querySelector('[class*="main"]')).not.toBeNull())
    expect(container.querySelectorAll('[class*="environmentRow"]').length).toBe(1)
    expect(container.querySelectorAll('[class*="serviceRow"]').length).toBe(2)
  })
})
