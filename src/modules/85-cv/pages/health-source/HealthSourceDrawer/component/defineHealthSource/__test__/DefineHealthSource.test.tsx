import React from 'react'
import { render } from '@testing-library/react'
import routes from '@common/RouteDefinitions'
import { TestWrapper, TestWrapperProps } from '@common/utils/testUtils'
import { accountPathProps, projectPathProps } from '@common/utils/routeUtils'
import DefineHealthSource from '../DefineHealthSource'

const testWrapperProps: TestWrapperProps = {
  path: routes.toCVAddMonitoringServicesSetup({ ...accountPathProps, ...projectPathProps }),
  pathParams: {
    accountId: '1234_accountId',
    projectIdentifier: '1234_project',
    orgIdentifier: '1234_org'
  }
}
describe('DefineHealthSource', () => {
  test('should matchsnapshot', () => {
    const { container } = render(
      <TestWrapper {...testWrapperProps}>
        <DefineHealthSource />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
