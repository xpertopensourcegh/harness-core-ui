/*
 * Copyright 2021 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { ActiveServiceInstancesContent } from '@cd/components/ServiceDetails/ActiveServiceInstances/ActiveServiceInstancesContent'
import * as cdngServices from 'services/cd-ng'

jest.mock('highcharts-react-official', () => () => <></>)

const mockData = {
  status: 'SUCCESS',
  data: {
    envBuildIdAndInstanceCountInfoList: [
      {
        envId: 'env1',
        envName: 'envName',
        buildIdAndInstanceCountList: [{ buildId: 'build1', count: 1 }, {}, { buildId: 'build3', count: 3 }]
      },
      {}
    ]
  }
}
jest.spyOn(cdngServices, 'useGetEnvBuildInstanceCount').mockImplementation(() => {
  return { loading: false, error: false, data: mockData, refetch: jest.fn() } as any
})
const noData = {
  status: 'SUCCESS',
  data: {}
}
describe('ActiveServiceInstancesContent', () => {
  test('should render ActiveServiceInstancesContent', () => {
    const { container, getByText } = render(
      <TestWrapper
        path="account/:accountId/cd/orgs/:orgIdentifier/projects/:projectIdentifier/services"
        pathParams={{ accountId: 'dummy', orgIdentifier: 'dummy', projectIdentifier: 'dummy' }}
      >
        <ActiveServiceInstancesContent />
      </TestWrapper>
    )
    fireEvent.click(getByText('cd.serviceDashboard.seeMore'))
    expect(container).toMatchSnapshot()
  })
  test('should render error', () => {
    jest.spyOn(cdngServices, 'useGetEnvBuildInstanceCount').mockImplementation(() => {
      return { loading: false, error: true, data: noData, refetch: jest.fn() } as any
    })
    const { container, getByText } = render(
      <TestWrapper>
        <ActiveServiceInstancesContent />
      </TestWrapper>
    )
    fireEvent.click(getByText('Retry'))
    expect(container).toMatchSnapshot()
  })

  test('should render loading', () => {
    jest.spyOn(cdngServices, 'useGetEnvBuildInstanceCount').mockImplementation(() => {
      return { loading: true, error: false, data: noData, refetch: jest.fn() } as any
    })
    const { container } = render(
      <TestWrapper>
        <ActiveServiceInstancesContent />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test('should render no data', () => {
    jest.spyOn(cdngServices, 'useGetEnvBuildInstanceCount').mockImplementation(() => {
      return {
        loading: false,
        error: false,
        data: noData,
        refetch: jest.fn()
      } as any
    })
    const { container } = render(
      <TestWrapper>
        <ActiveServiceInstancesContent />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
