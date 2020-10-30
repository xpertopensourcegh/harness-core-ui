import React from 'react'
import { render } from '@testing-library/react'
import { prependAccountPath, TestWrapper } from '@common/utils/testUtils'
import { defaultAppStoreValues } from '@projects-orgs/pages/projects/__tests__/DefaultAppStoreData'
import { routePipelineDetail } from 'navigation/cd/routes'
import PipelineDetails from '../PipelineDetails'
import { PipelineResponse } from './PipelineDetailsMocks'
jest.mock('services/cd-ng', () => ({
  useGetPipelineSummary: jest.fn(() => PipelineResponse)
}))
describe('Pipeline Details tests', () => {
  test('render snapshot view', async () => {
    const { container } = render(
      <TestWrapper
        path={prependAccountPath(routePipelineDetail.path)}
        pathParams={{
          accountId: 'testAcc',
          orgIdentifier: 'testOrg',
          projectIdentifier: 'test',
          pipelineIdentifier: 'pipeline'
        }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <PipelineDetails />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
  })
})
