import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { prependAccountPath, TestWrapper } from '@common/utils/testUtils'
import { routePipelineDeploymentList } from 'navigation/cd/routes'
import { defaultAppStoreValues } from '@projects-orgs/pages/projects/__tests__/DefaultAppStoreData'
import PipelineDeploymentList from '../PipelineDeploymentList'

jest.mock('@common/components/YAMLBuilder/YamlBuilder', () => ({ children }: { children: JSX.Element }) => (
  <div>{children}</div>
))

jest.mock('services/cd-ng', () => ({
  useGetListOfExecutions: jest.fn(() => ({
    data: {
      status: 'SUCCESS',
      data: {
        totalPages: 1,
        totalItems: 1,
        pageItemCount: 1,
        pageSize: 10,
        content: [
          {
            pipelineIdentifier: 'testp1',
            pipelineName: 'test-p1',
            deploymentId: 'DeploymentIdPlaceHolder',
            planExecutionId: 'TyNGXVdmRWi5vrOJopUKOg',
            executionStatus: 'Failed',
            startedAt: 1603645554243,
            endedAt: 1603645556832,
            tags: null,
            stageExecutionSummaryElements: [
              {
                stage: {
                  planExecutionId: 'TyNGXVdmRWi5vrOJopUKOg',
                  stageIdentifier: 'stage1',
                  serviceInfo: null,
                  stageName: 'stage1',
                  serviceDefinitionType: null,
                  executionStatus: 'NotStarted',
                  startedAt: null,
                  endedAt: null,
                  serviceIdentifier: null,
                  envIdentifier: 'prod1',
                  errorInfo: null
                }
              }
            ],
            errorMsg: null,
            stageIdentifiers: ['stage1'],
            serviceIdentifiers: [],
            envIdentifiers: ['prod1'],
            serviceDefinitionTypes: [],
            stageTypes: [{ type: 'Deployment' }],
            errorInfo: {
              message:
                'There was a critical error due to Current value is not in allowed values list while evaluating expression ${${expression}}'
            },
            triggerInfo: {
              triggeredBy: { uuid: 'lv0euRhKRCyiXWzS7pOg6g', name: 'Admin', email: 'admin@harness.io' },
              triggerType: 'MANUAL'
            },
            successfulStagesCount: 0,
            runningStagesCount: 0,
            failedStagesCount: 0
          }
        ],
        pageIndex: 0,
        empty: false
      },
      metaData: null,
      correlationId: 'b49cec93-aed7-4e1f-805d-0bfc520cb97c'
    },
    loading: false
  }))
}))

jest.mock('framework/exports', () => ({
  useRouteParams: jest.fn().mockImplementation(() => ({
    params: {
      accountId: 'testAcc',
      orgIdentifier: 'testOrg',
      projectIdentifier: 'test',
      pipelineIdentifier: 'pipeline'
    },
    query: { page: 1 }
  })),
  ModuleName: { CD: 'CD' },
  SidebarIdentifier: { CONTINUOUS_DEPLOYMENTS: 'CONTINUOUS_DEPLOYMENTS' },
  PageLayout: { BlankLayout: 'BlankLayout' },
  loggerFor: jest.fn()
}))

describe('Test Pipeline Deployment list', () => {
  beforeAll(() => {
    jest.spyOn(global.Date, 'now').mockReturnValue(1603645966706)
  })
  afterAll(() => {
    jest.spyOn(global.Date, 'now').mockReset()
  })
  // eslint-disable-next-line jest/no-disabled-tests
  test.skip('should render deployment list', async () => {
    const { container, getByText } = render(
      <TestWrapper
        path={prependAccountPath(routePipelineDeploymentList.path)}
        pathParams={{
          accountId: 'testAcc',
          orgIdentifier: 'testOrg',
          projectIdentifier: 'test',
          pipelineIdentifier: 'pipeline'
        }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <PipelineDeploymentList />
      </TestWrapper>
    )
    await waitFor(() => getByText('test-p1'))
    expect(container).toMatchSnapshot()
  })
})
