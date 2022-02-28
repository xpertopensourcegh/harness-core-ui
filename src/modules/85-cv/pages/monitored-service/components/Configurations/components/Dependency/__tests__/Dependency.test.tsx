/*
 * Copyright 2021 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'
import { render, waitFor, fireEvent } from '@testing-library/react'
import * as cvService from 'services/cv'
import { TestWrapper } from '@common/utils/testUtils'
import {
  monitoredServiceList,
  monitoredServiceForm,
  testWrapperProps,
  testWrapperEditProps,
  pathParams,
  monitoredServiceOfTypeInfrastructure
} from './Dependency.mock'
import Dependency from '../Dependency'

describe('Dependency compoennt', () => {
  test('should render all cards', async () => {
    jest.spyOn(cvService, 'useGetMonitoredServiceList').mockReturnValue({ data: monitoredServiceList } as any)
    const onSuccessMock = jest.fn()

    const { container, getByText } = render(
      <TestWrapper>
        <Dependency onSuccess={onSuccessMock} value={monitoredServiceForm} />
      </TestWrapper>
    )
    await waitFor(() => expect(container.querySelector('[class*="leftSection"]')).not.toBeNull())
    expect(container.querySelectorAll('[class~="serviceCard"]').length).toBe(3)
    expect(container.querySelector('[class*="monitoredServiceCategory"][class*="infrastructure"]')).not.toBeNull()
    expect(container.querySelector('[class*="monitoredServiceCategory"][class*="application"]')).not.toBeNull()
    fireEvent.click(getByText('save'))
    await waitFor(() =>
      expect(onSuccessMock).toHaveBeenLastCalledWith({
        dependencies: [],
        description: '',
        environmentRef: 'production',
        environmentRefList: ['production'],
        identifier: 'manager_production',
        isEdit: false,
        name: 'manager_production',
        serviceRef: 'manager',
        sources: {
          changeSources: [
            {
              category: 'Deployment',
              enabled: true,
              identifier: 'harness_cd',
              name: 'Harness CD',
              spec: {},
              type: 'HarnessCD'
            }
          ],
          healthSources: []
        },
        tags: {},
        type: 'Application'
      })
    )
  })

  test('Ensure loading is displayed on api loadng', async () => {
    jest.spyOn(cvService, 'useGetMonitoredServiceList').mockReturnValue({ loading: true } as any)
    const onSuccessMock = jest.fn()

    const { container } = render(
      <TestWrapper>
        <Dependency onSuccess={onSuccessMock} value={monitoredServiceForm} />
      </TestWrapper>
    )
    await waitFor(() => expect(container.querySelector('[class*="leftSection"]')).not.toBeNull())
    await waitFor(() => expect(container.querySelector('[class*="spinner"]')).not.toBeNull())
  })

  test('Ensure API useGetMonitoredServiceList is called with environmentIdentifiers - Create - Application', () => {
    jest.spyOn(cvService, 'useGetMonitoredServiceList').mockReturnValue({ data: monitoredServiceList } as any)

    render(
      <TestWrapper {...testWrapperProps}>
        <Dependency onSuccess={jest.fn()} value={monitoredServiceForm} cachedInitialValues={monitoredServiceForm} />
      </TestWrapper>
    )

    expect(cvService.useGetMonitoredServiceList).toHaveBeenLastCalledWith(
      expect.objectContaining({
        queryParams: { ...pathParams, environmentIdentifiers: ['production'], offset: 0, pageSize: 10 },
        queryParamStringifyOptions: {
          arrayFormat: 'repeat'
        }
      })
    )
  })

  test('Ensure API useGetMonitoredServiceList is called with environmentIdentifiers - Application', () => {
    jest.spyOn(cvService, 'useGetMonitoredServiceList').mockReturnValue({ data: monitoredServiceList } as any)

    render(
      <TestWrapper {...testWrapperEditProps}>
        <Dependency onSuccess={jest.fn()} value={monitoredServiceForm} />
      </TestWrapper>
    )

    expect(cvService.useGetMonitoredServiceList).toHaveBeenLastCalledWith(
      expect.objectContaining({
        queryParams: { ...pathParams, environmentIdentifiers: ['production'], offset: 0, pageSize: 10 },
        queryParamStringifyOptions: {
          arrayFormat: 'repeat'
        }
      })
    )
  })

  test('Ensure API useGetMonitoredServiceList is called with environmentIdentifiers - Create - Infrastructure', () => {
    jest.spyOn(cvService, 'useGetMonitoredServiceList').mockReturnValue({ data: monitoredServiceList } as any)

    render(
      <TestWrapper {...testWrapperEditProps}>
        <Dependency
          onSuccess={jest.fn()}
          value={monitoredServiceOfTypeInfrastructure}
          cachedInitialValues={monitoredServiceOfTypeInfrastructure}
        />
      </TestWrapper>
    )

    expect(cvService.useGetMonitoredServiceList).toHaveBeenLastCalledWith(
      expect.objectContaining({
        queryParams: {
          ...pathParams,
          environmentIdentifiers: ['production_one', 'production_two'],
          offset: 0,
          pageSize: 10
        },
        queryParamStringifyOptions: {
          arrayFormat: 'repeat'
        }
      })
    )
  })

  test('Ensure API useGetMonitoredServiceList is called with environmentIdentifiers - Infrastructure', () => {
    jest.spyOn(cvService, 'useGetMonitoredServiceList').mockReturnValue({ data: monitoredServiceList } as any)

    render(
      <TestWrapper {...testWrapperEditProps}>
        <Dependency onSuccess={jest.fn()} value={monitoredServiceOfTypeInfrastructure} />
      </TestWrapper>
    )

    expect(cvService.useGetMonitoredServiceList).toHaveBeenLastCalledWith(
      expect.objectContaining({
        queryParams: {
          ...pathParams,
          environmentIdentifiers: ['production_one', 'production_two'],
          offset: 0,
          pageSize: 10
        },
        queryParamStringifyOptions: {
          arrayFormat: 'repeat'
        }
      })
    )
  })
})
