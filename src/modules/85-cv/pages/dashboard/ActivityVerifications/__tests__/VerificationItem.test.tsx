import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import routes from '@common/RouteDefinitions'
import { accountPathProps, projectPathProps } from '@common/utils/routeUtils'
import VerificationItem, { mapTooltipItemStatus } from '../VerificationItem'

describe('VerificationItem', () => {
  test('VerificationItem', () => {
    const { container, getByText } = render(
      <TestWrapper
        path={routes.toCVProjectOverview({ ...accountPathProps, ...projectPathProps })}
        pathParams={{
          accountId: 'testAccountId',
          projectIdentifier: 'testProject',
          orgIdentifier: 'testOrg'
        }}
      >
        <VerificationItem
          item={{
            tag: 'tag1',
            serviceName: 'service1'
          }}
        />
      </TestWrapper>
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
