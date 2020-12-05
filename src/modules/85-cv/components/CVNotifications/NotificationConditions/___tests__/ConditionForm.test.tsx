import React from 'react'
import { render, waitFor, queryByText } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import mockEnvironments from '@cv/pages/onboarding/activity-source-setup/harness-cd/SelectEnvironment/__tests__/mockEnv-CD1.json'
import ConditionForm from '../ConditionsForm'

jest.mock('react-timeago', () => () => 'dummy date')
jest.mock('services/cd-ng', () => ({
  useGetEnvironmentListForProject: () => mockEnvironments,
  useGetServiceListForProject: jest.fn().mockImplementation(() => ({ loading: false }))
}))
jest.mock('services/cv', () => ({
  useGetActivityTypes: jest.fn().mockImplementation(() => ({})),
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
          ruleData={{} as any}
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
