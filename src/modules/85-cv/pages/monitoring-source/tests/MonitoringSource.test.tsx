import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { Container } from '@wings-software/uicore'
import { TestWrapper } from '@common/utils/testUtils'
import routes from '@common/RouteDefinitions'
import { accountPathProps, projectPathProps } from '@common/utils/routeUtils'
import { MonitoringSourceSetupRoutePaths } from '@cv/utils/routeUtils'
import MonitoringSource from '../MonitoringSource'

jest.mock('../app-dynamics/AppDMonitoringSource', () => () => <Container className="appdynamics" />)

describe('Unit tests for MonitoringSource', () => {
  test('Ensure appd is rendered based on url', async () => {
    // appd
    const { container } = render(
      <TestWrapper
        path={routes.toCVAdminSetupMonitoringSource({
          ...accountPathProps,
          ...projectPathProps,
          monitoringSource: ':monitoringSource'
        })}
        pathParams={{
          accountId: '1234_account',
          projectIdentifier: '1234_project',
          orgIdentifier: '1234_ORG',
          monitoringSource: MonitoringSourceSetupRoutePaths.APP_DYNAMICS
        }}
      >
        <MonitoringSource />
      </TestWrapper>
    )

    await waitFor(() => expect(container.querySelector('[class*="appdynamics"]')).not.toBeNull())
  })

  test('Ensure nothing is rendered based on URL', async () => {
    const { container } = render(
      <TestWrapper
        path={routes.toCVAdminSetupMonitoringSource({
          ...accountPathProps,
          ...projectPathProps,
          monitoringSource: ':monitoringSource'
        })}
        pathParams={{
          accountId: '1234_account',
          projectIdentifier: '1234_project',
          orgIdentifier: '1234_ORG',
          monitoringSource: 'skldfdsklf'
        }}
      >
        <MonitoringSource />
      </TestWrapper>
    )

    await waitFor(() =>
      expect(container.querySelector('.pageDimensions [class*="pageBody"]')?.children?.length).toBe(0)
    )
  })
})
