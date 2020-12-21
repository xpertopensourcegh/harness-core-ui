import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { defaultAppStoreValues } from '@projects-orgs/pages/projects/__tests__/DefaultAppStoreData'
import routes from '@common/RouteDefinitions'
import { accountPathProps, pipelineModuleParams, pipelinePathProps } from '@common/utils/routeUtils'
import PipelineDetails from '../PipelineDetails'
import { PipelineResponse } from './PipelineDetailsMocks'
jest.mock('services/pipeline-ng', () => ({
  useGetPipelineSummary: jest.fn(() => PipelineResponse)
}))

const TEST_PATH = routes.toPipelineDetail({ ...accountPathProps, ...pipelinePathProps, ...pipelineModuleParams })
describe('Pipeline Details tests', () => {
  test('render snapshot view', async () => {
    const { container } = render(
      <TestWrapper
        path={TEST_PATH}
        pathParams={{
          accountId: 'testAcc',
          orgIdentifier: 'testOrg',
          projectIdentifier: 'test',
          pipelineIdentifier: 'pipeline',
          module: 'cd'
        }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <PipelineDetails />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
  })
})
