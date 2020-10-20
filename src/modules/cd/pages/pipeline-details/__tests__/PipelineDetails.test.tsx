import React from 'react'
import { render } from '@testing-library/react'
import { prependAccountPath, TestWrapper } from 'modules/common/utils/testUtils'
import { defaultAppStoreValues } from 'modules/common/pages/ProjectsPage/__tests__/DefaultAppStoreData'
import { routePipelineDetail } from '../../../routes'
import PipelineDetails from '../PipelineDetails'
import { PipelineResponse } from './PipelineDetailsMocks'
jest.mock('services/cd-ng', () => ({
  useGetPipeline: jest.fn(() => PipelineResponse)
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
