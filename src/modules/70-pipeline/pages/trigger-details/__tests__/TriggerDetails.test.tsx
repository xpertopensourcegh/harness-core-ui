import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { defaultAppStoreValues } from '@projects-orgs/pages/projects/__tests__/DefaultAppStoreData'
import routes from '@common/RouteDefinitions'
import { PipelineResponse } from '@pipeline/pages/pipeline-details/__tests__/PipelineDetailsMocks'
import { accountPathProps, triggerPathProps, pipelineModuleParams } from '@common/utils/routeUtils'
import TriggerDetails from '../TriggerDetails'
import { GetTriggerResponse } from '../TriggerDetailsMock'
jest.mock('services/cd-ng', () => ({
  useGetTrigger: jest.fn(() => GetTriggerResponse),
  useGetPipelineSummary: jest.fn(() => PipelineResponse)
}))

const TEST_PATH = routes.toTriggersWizardPage({ ...accountPathProps, ...triggerPathProps, ...pipelineModuleParams })
describe('Trigger Details tests', () => {
  test('render snapshot view', async () => {
    const { container } = render(
      <TestWrapper
        path={TEST_PATH}
        pathParams={{
          accountId: 'testAcc',
          orgIdentifier: 'testOrg',
          projectIdentifier: 'test',
          pipelineIdentifier: 'pipeline',
          triggerIdentifier: 'triggerIdentifier',
          module: 'cd'
        }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <TriggerDetails />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
  })
})
