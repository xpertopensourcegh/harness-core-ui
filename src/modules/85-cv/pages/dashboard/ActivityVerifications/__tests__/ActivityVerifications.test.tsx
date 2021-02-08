import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { TestWrapper, NotFound, TestWrapperProps } from '@common/utils/testUtils'
import routes from '@common/RouteDefinitions'
import { accountPathProps, projectPathProps } from '@common/utils/routeUtils'
import ActivityVerifications from '../ActivityVerifications'

const testWrapperProps: TestWrapperProps = {
  path: routes.toCVProjectOverview({ ...accountPathProps, ...projectPathProps }),
  pathParams: {
    accountId: 'testAccountId',
    projectIdentifier: 'testProject',
    orgIdentifier: 'testOrg'
  }
}

jest.mock('services/cv', () => ({
  useGetRecentDeploymentActivityVerifications: () => ({
    data: {
      resource: [
        {
          tag: 'tag1',
          serviceName: 'service1'
        },
        {
          tag: 'tag2',
          serviceName: 'service2'
        }
      ]
    }
  })
}))

jest.mock('../VerificationItem', () => {
  return jest.fn().mockImplementation(props => (
    <div className="test-verification-item">
      <div className="triger-navigation" onClick={() => props.onSelect()} />
    </div>
  ))
})

describe('ActivityVerifications', () => {
  test('ActivityVerifications', () => {
    const { container } = render(
      <TestWrapper {...testWrapperProps}>
        <ActivityVerifications />
      </TestWrapper>
    )
    expect(container.querySelectorAll('.test-verification-item').length).toEqual(2)
  })

  test('onClick triggers navigation', () => {
    const { container, getByTestId } = render(
      <TestWrapper {...testWrapperProps}>
        <ActivityVerifications />
        <NotFound />
      </TestWrapper>
    )
    fireEvent.click(container.querySelector('.triger-navigation')!)
    const expectedUrlPart =
      '/account/testAccountId/cv/orgs/testOrg/projects/testProject/dashboard/deployment/tag1/service/service1'
    expect(getByTestId('location').innerHTML).toBe(expectedUrlPart)
  })
})
