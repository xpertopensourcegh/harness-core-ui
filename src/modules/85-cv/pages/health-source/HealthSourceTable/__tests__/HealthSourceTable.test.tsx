import React from 'react'
import { render } from '@testing-library/react'
import routes from '@common/RouteDefinitions'
import { TestWrapper, TestWrapperProps } from '@common/utils/testUtils'
import { accountPathProps, projectPathProps } from '@common/utils/routeUtils'
import HealthSourceTable from '../HealthSourceTable'

const testWrapperProps: TestWrapperProps = {
  path: routes.toCVAddMonitoringServicesSetup({ ...accountPathProps, ...projectPathProps }),
  pathParams: {
    accountId: '1234_accountId',
    projectIdentifier: '1234_project',
    orgIdentifier: '1234_org'
  }
}
describe('HealthSource table', () => {
  test('should matchsnapshot', () => {
    const props = {
      value: [],
      monitoringSourcRef: { monitoredServiceIdentifier: 'ms 101', monitoredServiceName: 'ms_101' },
      serviceRef: { label: 'service1', value: 'service1' },
      environmentRef: { label: 'environment1', value: 'environment1' },
      isEdit: false,
      onSuccess: () => {
        return 'sucess'
      },
      onDelete: () => {
        return 'sucess'
      }
    }
    const { container } = render(
      <TestWrapper {...testWrapperProps}>
        <HealthSourceTable {...props} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
