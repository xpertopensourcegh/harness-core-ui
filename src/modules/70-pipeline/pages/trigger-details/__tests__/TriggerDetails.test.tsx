import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { defaultAppStoreValues } from '@projects-orgs/pages/projects/__tests__/DefaultAppStoreData'
import routes from '@common/RouteDefinitions'
import { accountPathProps, triggerPathProps } from '@common/utils/routeUtils'
import TriggerDetails from '../TriggerDetails'
import { GetTriggerResponse } from '../TriggerDetailsMock'
jest.mock('services/cd-ng', () => ({
  useGetTrigger: jest.fn(() => GetTriggerResponse)
}))

const TEST_PATH = routes.toCDTriggersWizardPage({ ...accountPathProps, ...triggerPathProps })
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
          triggerIdentifier: 'triggerIdentifier'
        }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <TriggerDetails />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
  })
})
