import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { TestWrapper, TestWrapperProps } from '@common/utils/testUtils'
import routes from '@common/RouteDefinitions'
import { accountPathProps, projectPathProps } from '@common/utils/routeUtils'
import * as cvServices from 'services/cv'
import CVMonitoringSourcesPage from '../CVMonitoringSourcesPage'

jest.mock('@cv/components/ContextMenuActions/ContextMenuActions', () => (props: any) => {
  return (
    <>
      <div className="context-menu-mock-edit" onClick={props.onEdit} />
      <div className="context-menu-mock-delete" onClick={props.onDelete} />
    </>
  )
})

const testWrapperProps: TestWrapperProps = {
  path: routes.toCVAdminMonitoringSources({ ...accountPathProps, ...projectPathProps }),
  pathParams: {
    accountId: '1234_accountId',
    projectIdentifier: '1234_project',
    orgIdentifier: '1234_org',
    activitySource: '1234_activity'
  }
}

describe('CVMonitoringSourcesPage', () => {
  beforeAll(() => {
    jest.spyOn(cvServices, 'useGetMonitoringSources').mockImplementation(
      () =>
        ({
          data: {
            resource: {
              content: [
                {
                  monitoringSourceIdentifier: 'nameTTID',
                  monitoringSourceName: 'name',
                  type: 'APP_DYNAMICS',
                  importStatus: {
                    numberOfApplications: 2,
                    totalNumberOfApplications: 41,
                    numberOfEnvironments: 2,
                    totalNumberOfEnvironments: 9
                  },
                  numberOfServices: 2,
                  importedAt: 1607944938295
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

  test('Mathces snapshot', () => {
    const { container } = render(
      <TestWrapper {...testWrapperProps}>
        <CVMonitoringSourcesPage />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test('Fires edit flow', async () => {
    const { container, findByTestId } = render(
      <TestWrapper {...testWrapperProps}>
        <CVMonitoringSourcesPage />
      </TestWrapper>
    )
    fireEvent.click(container.querySelector('.context-menu-mock-edit')!)
    const path = await findByTestId('location')
    expect(path).toMatchInlineSnapshot(`
      <div
        data-testid="location"
      >
        /account/1234_accountId/cv/orgs/1234_org/projects/1234_project/admin/setup/monitoring-source/app-dynamics/nameTTID
      </div>
    `)
  })

  test('Delete works as expected', () => {
    const mutate = jest.fn()
    jest.spyOn(cvServices, 'useDeleteDSConfig').mockImplementation(() => ({ mutate } as any))
    const { container } = render(
      <TestWrapper {...testWrapperProps}>
        <CVMonitoringSourcesPage />
      </TestWrapper>
    )
    fireEvent.click(container.querySelector('.context-menu-mock-delete')!)
    expect(mutate).toHaveBeenCalled()
  })
})
