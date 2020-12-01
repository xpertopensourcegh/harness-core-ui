import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { accountPathProps, pipelinePathProps, projectPathProps } from '@common/utils/routeUtils'
import routes from '@common/RouteDefinitions'
import { defaultAppStoreValues } from '@projects-orgs/pages/projects/__tests__/DefaultAppStoreData'

import PipelineDeploymentList from '../PipelineDeploymentList'
import data from './pipeline-list.json'

jest.mock('@common/components/YAMLBuilder/YamlBuilder', () => ({ children }: { children: JSX.Element }) => (
  <div>{children}</div>
))

jest.mock('services/cd-ng', () => ({
  useGetListOfExecutions: jest.fn(() => data),
  useHandleInterrupt: jest.fn(() => ({})),
  useGetPipelineList: jest.fn(() => ({}))
}))

describe('Test Pipeline Deployment list', () => {
  beforeAll(() => {
    jest.spyOn(global.Date, 'now').mockReturnValue(1603645966706)
  })
  afterAll(() => {
    jest.spyOn(global.Date, 'now').mockReset()
  })

  // eslint-disable-next-line jest/no-disabled-tests
  test('should render deployment list', async () => {
    const { container, getByText } = render(
      <TestWrapper
        path={routes.toCDPipelineDeploymentList({ ...accountPathProps, ...pipelinePathProps })}
        pathParams={{
          accountId: 'testAcc',
          orgIdentifier: 'testOrg',
          projectIdentifier: 'test',
          pipelineIdentifier: 'pipeline'
        }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <PipelineDeploymentList onRunPipeline={jest.fn()} />
      </TestWrapper>
    )
    await waitFor(() => getByText('test-p1'))
    expect(container).toMatchSnapshot()
  })

  test('should render deployment list with pipeline filter', async () => {
    const { container, getByText } = render(
      <TestWrapper
        path={routes.toCDDeployments({ ...accountPathProps, ...projectPathProps })}
        pathParams={{
          accountId: 'testAcc',
          orgIdentifier: 'testOrg',
          projectIdentifier: 'testProject'
        }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <PipelineDeploymentList onRunPipeline={jest.fn()} />
      </TestWrapper>
    )
    await waitFor(() => getByText('test-p1'))

    expect(getByText('Pipelines', { selector: '.label' })).toBeDefined()
    expect(getByText('All', { selector: '.bp3-button.main > .bp3-button-text' })).toBeDefined()

    expect(container).toMatchSnapshot()
  })
})
