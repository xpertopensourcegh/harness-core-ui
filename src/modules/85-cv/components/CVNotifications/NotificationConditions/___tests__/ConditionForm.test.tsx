import React from 'react'
import { render, waitFor, queryByText } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import mockEnvironments from '@cv/pages/onboarding/activity-source-setup/harness-cd/SelectEnvironment/__tests__/mockEnvironments.json'
import ConditionForm from '../ConditionsForm'

jest.mock('react-timeago', () => () => 'dummy date')
jest.mock('services/cd-ng', () => ({
  useGetEnvironmentListForProject: () => mockEnvironments,
  useGetServiceListForProject: jest.fn().mockReturnValue({
    loading: false,
    data: {
      status: 'SUCCESS',
      data: {
        totalPages: 1,
        totalItems: 6,
        pageItemCount: 6,
        pageSize: 100,
        content: [
          {
            accountId: 'accountId',
            identifier: 'bvhj',
            orgIdentifier: 'OrgOneTwo',
            projectIdentifier: 'hello',
            name: 'bvhj',
            description: null,
            deleted: false,
            tags: {},
            version: 0
          },
          {
            accountId: 'accountId',
            identifier: 'bhgj',
            orgIdentifier: 'OrgOneTwo',
            projectIdentifier: 'hello',
            name: 'bhgj',
            description: null,
            deleted: false,
            tags: {},
            version: 0
          },
          {
            accountId: 'accountId',
            identifier: 'mnbdbefr',
            orgIdentifier: 'OrgOneTwo',
            projectIdentifier: 'hello',
            name: 'mnbdbefr',
            description: null,
            deleted: false,
            tags: {},
            version: 0
          },
          {
            accountId: 'accountId',
            identifier: 'service_name',
            orgIdentifier: 'OrgOneTwo',
            projectIdentifier: 'hello',
            name: 'service name',
            description: null,
            deleted: false,
            tags: {},
            version: 0
          },
          {
            accountId: 'accountId',
            identifier: 'nbdhgkgkd',
            orgIdentifier: 'OrgOneTwo',
            projectIdentifier: 'hello',
            name: ' nbdhgkgkd',
            description: null,
            deleted: false,
            tags: {},
            version: 0
          },
          {
            accountId: 'accountId',
            identifier: 'serviceone',
            orgIdentifier: 'OrgOneTwo',
            projectIdentifier: 'hello',
            name: 'serviceone',
            description: null,
            deleted: false,
            tags: {},
            version: 0
          }
        ],
        pageIndex: 0,
        empty: false
      },
      metaData: null,
      correlationId: '8b5d64aa-93f4-4858-984a-e0d5840f8e36'
    }
  })
}))
jest.mock('services/cv', () => ({
  useGetActivityTypes: jest.fn().mockReturnValue({
    data: {
      resource: ['PRE_DEPLOYMENT', 'DURING_DEPLOYMENT', 'POST_DEPLOYMENT', 'INFRASTRUCTURE_CHANGE', 'CONFIG_CHANGE']
    }
  }),
  useCreateAlert: jest.fn().mockImplementation(() => ({})),
  useUpdateAlert: jest.fn().mockImplementation(() => ({}))
}))
describe('ConditionForm', () => {
  test('render ConditionForm ', async () => {
    const { container } = render(
      <TestWrapper
        pathParams={{ accountId: 'dummy', projectIdentifier: 'projectIdentifier', orgIdentifier: 'orgidentifier' }}
      >
        <ConditionForm
          ruleData={
            {
              services: ['bvhj', 'sdfsf'],
              environments: ['ndbhjdh', 'sdfsfd'],
              activityTypes: ['PRE_DEPLOYMENT', 'DURING_DEPLOYMENT', 'POST_DEPLOYMENT', 'INFRASTRUCTURE_CHANGE'],
              verificationStatuses: ['PASSED']
            } as any
          }
          isEditMode={false}
          onSuccess={jest.fn()}
          setRuleData={jest.fn()}
          hideModal={jest.fn()}
          projectIdentifier={'projectIdentifier'}
          orgIdentifier="orgidentifier"
        />
      </TestWrapper>
    )
    await waitFor(() => queryByText(container, 'Conditions'))

    expect(container).toMatchSnapshot()
  })
})
