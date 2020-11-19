import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { useHistory } from 'react-router-dom'
import ActivityVerifications from '../ActivityVerifications'

jest.mock('framework/exports', () => ({
  ...(jest.requireActual('framework/exports') as any),
  useRouteParams: () => ({
    params: {
      accountId: 'testAccountId',
      projectIdentifier: 'testProject',
      orgIdentifier: 'testOrg'
    }
  })
}))

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn().mockReturnValue({
    push: jest.fn()
  })
}))

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
      <div className="triger-navigation" onClick={props.onClick} />
    </div>
  ))
})

describe('ActivityVerifications', () => {
  test('ActivityVerifications', () => {
    const { container } = render(<ActivityVerifications />)
    expect(container.querySelectorAll('.test-verification-item').length).toEqual(2)
  })

  test('onClick triggers navigation', () => {
    const callback = jest.fn()
    ;(useHistory as any).mockReturnValue({
      push: callback
    })
    const { container } = render(<ActivityVerifications />)
    fireEvent.click(container.querySelector('.triger-navigation')!)
    const expectedUrlPart = '/cv/dashboard/deployment/tag1/service/service1/org/testOrg/project/testProject'
    expect(callback.mock.calls[0][0].indexOf(expectedUrlPart)).toBeGreaterThan(-1)
  })
})
