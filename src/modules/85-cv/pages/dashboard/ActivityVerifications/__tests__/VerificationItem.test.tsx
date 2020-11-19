import React from 'react'
import { render } from '@testing-library/react'
import VerificationItem, { mapTooltipItemStatus } from '../VerificationItem'

jest.mock('framework/exports', () => ({
  useRouteParams: () => ({
    params: {
      accountId: 'testAccountId',
      projectIdentifier: 'testProject',
      orgIdentifier: 'testOrg'
    }
  })
}))

describe('VerificationItem', () => {
  test('VerificationItem', () => {
    const { container, getByText } = render(
      <VerificationItem
        item={{
          tag: 'tag1',
          serviceName: 'service1'
        }}
      />
    )
    expect(container).toMatchSnapshot()
    expect(getByText('tag1')).toBeDefined()
    expect(getByText('service1')).toBeDefined()
  })
  test('mapTooltipItemStatus works correctly', () => {
    expect(mapTooltipItemStatus('IN_PROGRESS', 60000)).toEqual('1min remaining')
    expect(mapTooltipItemStatus('ERROR')).toEqual('Error')
    expect(mapTooltipItemStatus('NOT_STARTED')).toEqual('Not Started')
    expect(mapTooltipItemStatus('VERIFICATION_FAILED')).toEqual('Failed')
    expect(mapTooltipItemStatus('VERIFICATION_PASSED')).toEqual('Passed')
  })
})
