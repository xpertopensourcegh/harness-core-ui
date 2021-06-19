import React from 'react'
import { render } from '@testing-library/react'

import { TestWrapper } from '@common/utils/testUtils'
import { JiraApprovalTab } from '../JiraApprovalTab'
import approvalData from './JiraAprovalData.json'

jest.mock('@common/components/Duration/Duration', () => ({
  Duration() {
    return <div>MOCK DURATION</div>
  }
}))

jest.mock('@common/components/YAMLBuilder/YamlBuilder')

describe('<JiraApprovalTab/> tests', () => {
  test('isWaiting test', () => {
    const { container } = render(
      <TestWrapper>
        <JiraApprovalTab isWaiting={true} approvalData={approvalData as any} />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
  })

  test('not isWaiting test', () => {
    const { container } = render(
      <TestWrapper>
        <JiraApprovalTab isWaiting={false} approvalData={approvalData as any} />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
  })

  test('not isWaiting test - rejected', () => {
    const rejectedData = { ...approvalData } as any
    rejectedData.status = 'REJECTED'
    const { container } = render(
      <TestWrapper>
        <JiraApprovalTab isWaiting={false} approvalData={rejectedData as any} />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
  })
})
