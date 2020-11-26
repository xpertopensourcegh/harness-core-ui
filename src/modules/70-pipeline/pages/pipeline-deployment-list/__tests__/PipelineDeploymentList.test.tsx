import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { prependAccountPath, TestWrapper } from '@common/utils/testUtils'
import { routePipelineDeploymentList } from 'navigation/cd/routes'
import { defaultAppStoreValues } from '@projects-orgs/pages/projects/__tests__/DefaultAppStoreData'

import PipelineDeploymentList from '../PipelineDeploymentList'
import data from './pipeline-list.json'

jest.mock('@common/components/YAMLBuilder/YamlBuilder', () => ({ children }: { children: JSX.Element }) => (
  <div>{children}</div>
))

jest.mock('services/cd-ng', () => ({
  useGetListOfExecutions: jest.fn(() => data),
  useHandleInterrupt: jest.fn(() => ({}))
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
        path={prependAccountPath(routePipelineDeploymentList.path)}
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
})
