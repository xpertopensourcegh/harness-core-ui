import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import routes from '@common/RouteDefinitions'
import { TestWrapper, TestWrapperProps } from '@common/utils/testUtils'
import { accountPathProps, projectPathProps } from '@common/utils/routeUtils'
import * as cvServices from 'services/cv'
import CVVerificationJobsPage from '../CVVerificationJobsPage'

const testWrapperProps: TestWrapperProps = {
  path: routes.toCVAdminMonitoringSources({ ...accountPathProps, ...projectPathProps }),
  pathParams: {
    accountId: '1234_accountId',
    projectIdentifier: '1234_project',
    orgIdentifier: '1234_org',
    activitySource: '1234_activity'
  }
}

jest.mock('@cv/components/ContextMenuActions/ContextMenuActions', () => (props: any) => {
  return (
    <>
      <div className="context-menu-mock-edit" onClick={props.onEdit} />
      <div className="context-menu-mock-delete" onClick={props.onDelete} />
    </>
  )
})

describe('CVVerificationJobsPage', () => {
  beforeAll(() => {
    jest.spyOn(cvServices, 'useGetVerificationJobs').mockImplementation(
      () =>
        ({
          data: {
            resource: {
              content: [
                {
                  identifier: 'Job1',
                  jobName: 'Job1',
                  serviceIdentifier: 'ServiceA',
                  envIdentifier: 'Prod',
                  projectIdentifier: 'MilosTest',
                  orgIdentifier: 'cv_stable',
                  activitySourceIdentifier: null,
                  dataSources: ['APP_DYNAMICS'],
                  duration: '30m',
                  sensitivity: 'HIGH',
                  baselineVerificationJobInstanceId: null,
                  type: 'TEST',
                  defaultJob: false
                },
                {
                  identifier: 'MilosJob1',
                  jobName: 'MilosJob1',
                  serviceIdentifier: 'ServiceA',
                  envIdentifier: 'Prod',
                  projectIdentifier: 'MilosTest',
                  orgIdentifier: 'cv_stable',
                  activitySourceIdentifier: null,
                  dataSources: ['STACKDRIVER'],
                  duration: '10m',
                  sensitivity: 'MEDIUM',
                  trafficSplitPercentage: null,
                  type: 'BLUE_GREEN',
                  defaultJob: false
                },
                {
                  identifier: 'MilosTest_DEFAULT_HEALTH_JOB',
                  jobName: 'MilosTest_DEFAULT_HEALTH_JOB',
                  serviceIdentifier: '${serviceIdentifier}',
                  envIdentifier: '${envIdentifier}',
                  projectIdentifier: 'MilosTest',
                  orgIdentifier: 'cv_stable',
                  activitySourceIdentifier: null,
                  dataSources: ['APP_DYNAMICS', 'SPLUNK', 'STACKDRIVER'],
                  duration: '15m',
                  type: 'HEALTH',
                  defaultJob: true
                }
              ]
            }
          },
          loading: false,
          refetch: jest.fn(),
          error: {}
        } as any)
    )
  })
  test('matches snapshot', () => {
    const { container } = render(
      <TestWrapper {...testWrapperProps}>
        <CVVerificationJobsPage />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test('edit flow works correctly', async () => {
    const { container, findByTestId } = render(
      <TestWrapper {...testWrapperProps}>
        <CVVerificationJobsPage />
      </TestWrapper>
    )
    fireEvent.click(container.querySelector('.context-menu-mock-edit')!)
    const path = await findByTestId('location')
    expect(path).toMatchInlineSnapshot(`
      <div
        data-testid="location"
      >
        /account/1234_accountId/cv/orgs/1234_org/projects/1234_project/admin/setup/verification-job/verificationId/Job1
      </div>
    `)
  })
})
